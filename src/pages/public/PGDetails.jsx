import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Users, 
  Utensils, 
  CheckCircle2, 
  Heart,
  ChevronLeft,
  Send,
  Edit,
  Star,
  MessageSquarePlus,
  Filter,
  Calendar,
  Flag,
  Info,
  ShieldAlert,
  DoorOpen,
  Bed as BedIcon
} from 'lucide-react';

import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import Toast from '../../components/common/Toast';
import Pagination from '../../components/common/Pagination';

import RatingSummary from '../../components/review/RatingSummary';
import ReviewCard from '../../components/review/ReviewCard';
import ReviewFormModal from '../../components/review/ReviewFormModal';
import ScheduleVisitModal from '../../components/visit/ScheduleVisitModal';
import SEO from '../../components/common/SEO';
import ReportModal from '../../components/report/ReportModal';

import { getPublicPGById } from '../../services/pgService';
import { savePG, removePG, getFavoriteStatus } from '../../services/favoriteService';
import { createEnquiry } from '../../services/enquiryService';
import { getPGReviews, getReviewEligibility, createReview } from '../../services/reviewService';
import { getRoomsByPG } from '../../services/roomService';
import { useAuth } from '../../context/AuthContext';

import ImageLightbox from '../../components/pg/ImageLightbox';
import { addRecentlyViewed } from '../../utils/recentlyViewed';
import { Share2 } from 'lucide-react';

export default function PGDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [pg, setPg] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Favorite State
  const [isSaved, setIsSaved] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Enquiry Modal State
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState('Room availability enquiry');
  const [enquiryMessage, setEnquiryMessage] = useState('');
  const [enquiryLoading, setEnquiryLoading] = useState(false);

  // Visit Modal State
  const [isScheduleVisitOpen, setIsScheduleVisitOpen] = useState(false);

  // Report Modal State
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Trust Disclosure Modal
  const [isTrustInfoOpen, setIsTrustInfoOpen] = useState(false);

  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({ average: 0, count: 0, distribution: { one: 0, two: 0, three: 0, four: 0, five: 0 } });
  const [reviewPagination, setReviewPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [reviewSort, setReviewSort] = useState('newest');
  const [reviewFilterRating, setReviewFilterRating] = useState('');
  const [reviewCurrentPage, setReviewCurrentPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Review Eligibility State
  const [eligibility, setEligibility] = useState({ eligible: false, reason: null, alreadyReviewed: false });

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const handleSharePG = async () => {
    const shareData = {
      title: pg?.name || 'PGFinder Property',
      text: `Check out ${pg?.name} in ${pg?.address?.locality || pg?.address?.city} on PGFinder!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Property link copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy link', 'error');
      }
    }
  };

  // Fetch PG details & Rooms
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.all([getPublicPGById(id), getRoomsByPG(id)])
      .then(([pgRes, roomRes]) => {
        if (isMounted) {
          if (pgRes.data?.pg) {
            setPg(pgRes.data.pg);
            addRecentlyViewed(pgRes.data.pg);
          }
          if (roomRes.data?.rooms) setRooms(roomRes.data.rooms);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [id]);

  // Fetch Favorite Status for Seeker
  useEffect(() => {
    if (isAuthenticated && user?.role === 'SEEKER' && id) {
      getFavoriteStatus(id)
        .then((res) => setIsSaved(res.data?.isSaved || false))
        .catch(() => setIsSaved(false));
    }
  }, [id, isAuthenticated, user]);

  // Fetch Reviews
  const fetchReviews = useCallback(() => {
    if (!id) return;
    setReviewsLoading(true);
    getPGReviews(id, {
      sort: reviewSort,
      rating: reviewFilterRating || undefined,
      page: reviewCurrentPage,
      limit: 10,
    })
      .then((res) => {
        if (res.data) {
          setReviews(res.data.reviews || []);
          if (res.data.summary) setRatingSummary(res.data.summary);
          if (res.data.pagination) setReviewPagination(res.data.pagination);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setReviewsLoading(false));
  }, [id, reviewSort, reviewFilterRating, reviewCurrentPage]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Check Review Eligibility for Seeker
  useEffect(() => {
    if (isAuthenticated && user?.role === 'SEEKER' && id) {
      getReviewEligibility(id)
        .then((res) => {
          if (res.data) setEligibility(res.data);
        })
        .catch(() => setEligibility({ eligible: false, reason: null, alreadyReviewed: false }));
    }
  }, [id, isAuthenticated, user]);

  // Handle Save / Favorite Toggle
  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'SEEKER') return;

    setFavLoading(true);
    try {
      if (isSaved) {
        await removePG(id);
        setIsSaved(false);
        showToast('Removed from saved PGs', 'info');
      } else {
        await savePG(id);
        setIsSaved(true);
        showToast('Saved to your favorites!', 'success');
      }
    } catch (err) {
      showToast('Action failed. Please try again.', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  // Handle Send Enquiry Submission
  const handleSendEnquiry = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!enquirySubject || !enquiryMessage) {
      showToast('Please fill out subject and message.', 'error');
      return;
    }

    setEnquiryLoading(true);
    try {
      await createEnquiry({
        pgId: id,
        subject: enquirySubject,
        message: enquiryMessage,
      });

      setIsEnquiryOpen(false);
      setEnquiryMessage('');
      showToast('Enquiry sent successfully! Owner will contact you soon.', 'success');
    } catch (err) {
      showToast('Failed to send enquiry. Please try again.', 'error');
    } finally {
      setEnquiryLoading(false);
    }
  };

  // Handle Submit Review
  const handleReviewSubmit = async (reviewData) => {
    try {
      await createReview({
        pgId: id,
        ...reviewData,
      });

      showToast('Review submitted successfully!', 'success');
      setEligibility({ eligible: false, reason: null, alreadyReviewed: true });
      fetchReviews();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    }
  };

  if (loading) {
    return <Loader fullScreen text="Loading PG details..." />;
  }

  if (!pg) {
    return (
      <div className="py-12">
        <EmptyState
          title="PG Not Found"
          description="The property listing you are looking for does not exist or has been removed."
          actionText="Back to Search"
          actionTo="/search"
        />
      </div>
    );
  }

  const isOwnerOfThisPG = user?.role === 'OWNER' && (user.id === pg.owner?._id || user.id === pg.owner?.id || user.id === pg.owner);
  const isVerifiedOwner = pg.owner?.isVerifiedOwner || false;
  const isVerifiedListing = pg.isVerifiedPG || pg.status === 'APPROVED';
  const isBookable = pg.status === 'APPROVED' && pg.onlineBookingEnabled !== false && rooms.some((r) => r.status === 'ACTIVE' && (r.beds || []).some((b) => b.status === 'AVAILABLE'));
  const locationText = pg.address?.locality ? `${pg.address.locality}, ${pg.address.city}, ${pg.address.state || ''}` : pg.address?.city || pg.location || 'Noida';
  const coverImg = pg.images?.[activeImageIndex]?.url || pg.images?.[0]?.url || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="bg-slate-50 min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back Link */}
        <Link to="/search" className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-[#2563EB]">
          <ChevronLeft className="w-4 h-4" />
          Back to Search Results
        </Link>

        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">{pg.name}</h1>
              
              {/* Trust Badges */}
              {isVerifiedListing && (
                <button
                  type="button"
                  onClick={() => setIsTrustInfoOpen(true)}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-emerald-100 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Listing
                </button>
              )}

              {isVerifiedOwner && (
                <button
                  type="button"
                  onClick={() => setIsTrustInfoOpen(true)}
                  className="bg-blue-50 text-[#2563EB] border border-blue-200 text-[11px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 hover:bg-blue-100 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Verified Owner
                </button>
              )}

              {ratingSummary.count > 0 && (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                  {ratingSummary.average.toFixed(1)} ({ratingSummary.count} reviews)
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-[#2563EB]" />
              {locationText}
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              size="md"
              onClick={handleSharePG}
              icon={Share2}
            >
              Share
            </Button>

            <Button
              variant={isSaved ? 'primary' : 'outline'}
              size="md"
              onClick={handleFavoriteToggle}
              loading={favLoading}
              icon={Heart}
              className={isSaved ? 'bg-rose-600 hover:bg-rose-700 text-white' : ''}
            >
              {isSaved ? 'Saved' : 'Save PG'}
            </Button>

            {isOwnerOfThisPG ? (
              <Link to={`/owner/pgs/${id}/edit`}>
                <Button variant="secondary" size="md" icon={Edit}>
                  Manage PG
                </Button>
              </Link>
            ) : user?.role === 'OWNER' ? (
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl">
                Owner Mode Active
              </span>
            ) : user?.role === 'ADMIN' ? (
              <Link to={`/admin/pgs/${id}`}>
                <Button variant="outline" size="md">
                  Admin Review
                </Button>
              </Link>
            ) : (
              <>
                {isBookable && (
                  <Button
                    variant="primary"
                    size="md"
                    icon={DoorOpen}
                    onClick={() => {
                      if (!isAuthenticated) navigate('/login');
                      else navigate(`/seeker/book/${id}`);
                    }}
                  >
                    Book Now
                  </Button>
                )}
                <Button
                  variant="secondary"
                  size="md"
                  icon={Calendar}
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setIsScheduleVisitOpen(true);
                  }}
                >
                  Schedule Visit
                </Button>
                <Button variant="outline" size="md" icon={Send} onClick={() => setIsEnquiryOpen(true)}>
                  Send Enquiry
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Image Gallery Grid */}
        <div className="space-y-3">
          <div
            onClick={() => {
              setLightboxIndex(activeImageIndex);
              setIsLightboxOpen(true);
            }}
            className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-100 rounded-3xl overflow-hidden shadow-md cursor-pointer group"
          >
            <img src={coverImg} alt={pg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute bottom-3 right-3 bg-slate-900/80 text-white text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-xs">
              Click to View Gallery ({pg.images?.length || 1})
            </span>
          </div>

          {pg.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {pg.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#2563EB] scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Main Details & Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Col: Features, Rooms, Rules, Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Description Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-lg font-black text-[#0F172A]">About this PG</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {pg.description || 'Modern PG accommodation offering comfortable living spaces, essential amenities, and peaceful environment.'}
              </p>
            </div>

            {/* Room Types Card */}
            {rooms.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-[#2563EB]" />
                  Available Rooms & Bed Sharing Options
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {rooms.map((rm, idx) => {
                    const rmId = rm._id || rm.id;
                    const availCount = (rm.beds || []).filter((b) => b.status === 'AVAILABLE').length;

                    return (
                      <div key={rmId || idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#0F172A]">
                            Room {rm.roomNumber} ({rm.roomType ? rm.roomType.replace('_', ' ') : 'DOUBLE'})
                          </span>
                          <Badge variant="primary">₹{rm.rent?.toLocaleString('en-IN')}/mo</Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-500 font-medium">Beds Inventory:</span>
                          <span className="font-extrabold text-emerald-600">
                            {availCount > 0 ? `${availCount} Available` : 'Currently Full'}
                          </span>
                        </div>

                        {availCount > 0 && isBookable && !isOwnerOfThisPG && user?.role !== 'ADMIN' && (
                          <div className="pt-1">
                            <Button
                              variant="primary"
                              size="xs"
                              fullWidth
                              icon={DoorOpen}
                              onClick={() => {
                                if (!isAuthenticated) navigate('/login');
                                else navigate(`/seeker/book/${id}`);
                              }}
                            >
                              Book Room {rm.roomNumber}
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Amenities & Facilities */}
            {pg.facilities && pg.facilities.length > 0 && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-lg font-black text-[#0F172A]">Amenities & Facilities</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pg.facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS & RATINGS SECTION */}
            <div className="space-y-6 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-black text-[#0F172A] flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-500 fill-current" />
                    Ratings & Guest Reviews
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Authentic reviews submitted by verified guests.
                  </p>
                </div>
              </div>

              <RatingSummary ratingSummary={ratingSummary} />

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((n) => (
                    <div key={n} className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse h-32" />
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-2">
                  <p className="text-sm font-bold text-slate-700">No Reviews Yet</p>
                  <p className="text-xs text-slate-500">
                    Be the first guest to share your staying experience at {pg.name}.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev._id || rev.id} review={rev} />
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Col: Contact & Booking Card */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-5 sticky top-24">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase">Monthly Rent Starts From</span>
                <div className="text-3xl font-black text-[#0F172A] mt-1">
                  ₹{(pg.rent?.min || 8000).toLocaleString('en-IN')}
                  <span className="text-sm font-normal text-slate-500"> /month</span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {isOwnerOfThisPG ? (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-700 font-bold text-center">
                    This is your PG property listing.
                  </div>
                ) : (
                  <>
                    {isBookable && (
                      <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        icon={DoorOpen}
                        onClick={() => {
                          if (!isAuthenticated) navigate('/login');
                          else navigate(`/seeker/book/${id}`);
                        }}
                      >
                        Book Now
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      fullWidth
                      size="lg"
                      icon={Calendar}
                      onClick={() => {
                        if (!isAuthenticated) navigate('/login');
                        else setIsScheduleVisitOpen(true);
                      }}
                    >
                      Schedule Physical Visit
                    </Button>
                    <Button variant="outline" fullWidth size="lg" icon={Send} onClick={() => setIsEnquiryOpen(true)}>
                      Send Online Enquiry
                    </Button>
                  </>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-[#0F172A]">Property Contact Info</h4>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                  {pg.contact?.phone || '+91 98765 43210'}
                </p>
                {pg.contact?.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[#2563EB]" />
                    {pg.contact.email}
                  </p>
                )}
              </div>

              {/* Seeker Safety Tips Card */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2 text-xs text-amber-900">
                <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Seeker Safety Guidelines
                </h4>
                <ul className="space-y-1 text-[11px] text-amber-800 list-disc list-inside font-medium">
                  <li>Schedule a visit to inspect the PG before paying any advance.</li>
                  <li>Verify physical room facilities and address personally.</li>
                </ul>
              </div>

              {/* Report Listing Trigger */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) navigate('/login');
                    else setIsReportOpen(true);
                  }}
                  className="text-xs font-bold text-slate-400 hover:text-rose-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                >
                  <Flag className="w-3.5 h-3.5" />
                  Report this PG Listing
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Trust Explanation Modal */}
      <Modal isOpen={isTrustInfoOpen} onClose={() => setIsTrustInfoOpen(false)} title="Verification & Trust Standards">
        <div className="space-y-4 text-xs font-sans text-slate-600">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-blue-900 space-y-1">
            <h4 className="font-extrabold flex items-center gap-1.5 text-sm text-blue-950">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              Verified on PGFinder
            </h4>
            <p>
              The "Verified Owner" badge signifies that the landlord has submitted official identity and property authorization documents.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setIsTrustInfoOpen(false)}>
              Got it
            </Button>
          </div>
        </div>
      </Modal>

      {/* Report Listing Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        pg={pg}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        isOpen={isScheduleVisitOpen}
        onClose={() => setIsScheduleVisitOpen(false)}
        pg={pg}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Send Enquiry Modal */}
      <Modal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} title={`Enquire for ${pg.name}`}>
        <div className="space-y-4">
          <Input
            label="Enquiry Subject"
            value={enquirySubject}
            onChange={(e) => setEnquirySubject(e.target.value)}
            required
          />

          <Textarea
            label="Your Message"
            placeholder="Ask about room availability, moving date, or food options..."
            rows={4}
            required
            value={enquiryMessage}
            onChange={(e) => setEnquiryMessage(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsEnquiryOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" loading={enquiryLoading} onClick={handleSendEnquiry}>
              Submit Enquiry
            </Button>
          </div>
        </div>
      </Modal>

      {/* Image Lightbox Fullscreen Modal */}
      <ImageLightbox
        images={pg.images || []}
        initialIndex={lightboxIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />
    </div>
  );
}
