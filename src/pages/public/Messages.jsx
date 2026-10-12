import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Send, 
  Building2, 
  MapPin, 
  Check, 
  CheckCheck, 
  Search, 
  ArrowLeft,
  Calendar,
  DoorOpen,
  User,
  ShieldCheck,
  Flag,
  Sparkles
} from 'lucide-react';

import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import Toast from '../../components/common/Toast';

import { getMyEnquiries, getOwnerEnquiries, respondToEnquiry } from '../../services/enquiryService';
import { createReport } from '../../services/reportService';
import { useAuth } from '../../context/AuthContext';

export default function Messages() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const activeEnquiryId = searchParams.get('id');

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Report Conversation Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('HARASSMENT');
  const [reportDetails, setReportDetails] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  // Toast Feedback State
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isToastOpen, setIsToastOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const showToast = (msg, type = 'success') => {
    setToastMsg(msg);
    setToastType(type);
    setIsToastOpen(true);
  };

  const fetchConversations = async () => {
    setLoading(true);
    try {
      let res;
      if (user?.role === 'OWNER') {
        res = await getOwnerEnquiries();
      } else {
        res = await getMyEnquiries();
      }

      const list = res.data?.enquiries || [];
      setConversations(list);

      if (list.length > 0) {
        if (activeEnquiryId) {
          const match = list.find((c) => (c._id || c.id) === activeEnquiryId);
          setSelectedConv(match || list[0]);
        } else {
          setSelectedConv(list[0]);
        }
      }
    } catch (err) {
      showToast('Failed to load messaging threads.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user?.role, activeEnquiryId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedConv]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    const convId = selectedConv._id || selectedConv.id;
    setSending(true);

    try {
      if (user?.role === 'OWNER') {
        await respondToEnquiry(convId, replyText.trim());
        showToast('Response sent to seeker.', 'success');
      } else {
        showToast('Enquiry message sent to owner.', 'success');
      }
      setReplyText('');
      setIsTyping(false);
      fetchConversations();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send message.', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleQuickSuggestion = (text) => {
    setReplyText(text);
  };

  const handleInputChange = (e) => {
    setReplyText(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  const handleReportConversation = async (e) => {
    e.preventDefault();
    if (!selectedConv) return;

    const pgId = selectedConv.pg?._id || selectedConv.pg?.id || selectedConv.pg;

    setReportLoading(true);
    try {
      await createReport({
        pgId,
        reason: reportReason,
        description: reportDetails.trim() || `Report regarding conversation thread #${selectedConv._id || selectedConv.id}`,
      });

      showToast('Report submitted for admin review.', 'success');
      setIsReportModalOpen(false);
      setReportDetails('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit report.', 'error');
    } finally {
      setReportLoading(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const pgName = c.pg?.name || '';
    const seekerName = c.seeker?.name || '';
    const ownerName = c.owner?.name || '';
    const subject = c.subject || '';
    const term = searchQuery.toLowerCase();

    return (
      pgName.toLowerCase().includes(term) ||
      seekerName.toLowerCase().includes(term) ||
      ownerName.toLowerCase().includes(term) ||
      subject.toLowerCase().includes(term)
    );
  });

  if (loading) return <Loader text="Loading real-time chat hub..." center size="lg" />;

  return (
    <Container className="py-6 font-sans max-w-6xl mx-auto space-y-4">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#0F172A] tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[#2563EB]" />
            Real-Time Chat & Communication
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Direct messages regarding room availability, property rules, and visit schedules.
          </p>
        </div>
      </div>

      {/* Main Messaging Portal Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden min-h-[620px] grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Col: Conversation List */}
        <div className={`md:col-span-5 lg:col-span-4 border-r border-slate-200 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Search Bar */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Conversation List Items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold">
                No active conversation threads.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const convId = conv._id || conv.id;
                const isSelected = selectedConv && (selectedConv._id || selectedConv.id) === convId;
                const otherPartyName = user?.role === 'OWNER' ? (conv.seeker?.name || 'Seeker Guest') : (conv.owner?.name || 'Property Landlord');
                const pgTitle = conv.pg?.name || 'PGFinder Property';
                const timeStr = conv.updatedAt ? new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';

                return (
                  <div
                    key={convId}
                    onClick={() => setSelectedConv(conv)}
                    className={`p-4 cursor-pointer transition-colors space-y-1.5 ${
                      isSelected ? 'bg-blue-50/80 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-[#0F172A] truncate max-w-[170px]">{pgTitle}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{timeStr}</span>
                    </div>

                    <div className="text-[11px] font-bold text-slate-600 truncate flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400 shrink-0" />
                      {otherPartyName}
                    </div>

                    <p className="text-xs text-slate-500 truncate">{conv.ownerReply || conv.message}</p>

                    <div className="flex items-center justify-between pt-1">
                      <Badge variant={conv.status === 'RESPONDED' ? 'primary' : conv.status === 'CLOSED' ? 'neutral' : 'warning'}>
                        {conv.status}
                      </Badge>

                      {conv.status === 'RESPONDED' && (
                        <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Col: Active Chat Conversation */}
        <div className={`md:col-span-7 lg:col-span-8 flex flex-col justify-between bg-slate-50/50 ${!selectedConv ? 'hidden md:flex' : 'flex'}`}>
          {selectedConv ? (
            <>
              {/* Active Header */}
              <div className="bg-white p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedConv(null)}
                    className="md:hidden p-1 text-slate-400 hover:text-slate-700"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div>
                    <h3 className="font-black text-sm text-[#0F172A] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      {selectedConv.pg?.name || 'Property Enquiry'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Subject: <span className="font-bold text-slate-700">{selectedConv.subject}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/pg/${selectedConv.pg?._id || selectedConv.pg?.id || selectedConv.pg}`}>
                    <Button variant="outline" size="xs">
                      View PG
                    </Button>
                  </Link>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Report Conversation"
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                
                <div className="text-center my-2">
                  <span className="bg-blue-100 text-blue-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase border border-blue-200">
                    System Ticket Created: {selectedConv.subject}
                  </span>
                </div>

                {/* Seeker Bubble */}
                <div className="flex flex-col items-start space-y-1">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs max-w-[85%] font-sans text-xs text-slate-800 space-y-1">
                    <div className="font-bold text-[11px] text-slate-400">
                      {selectedConv.seeker?.name || 'Seeker'}
                    </div>
                    <p>{selectedConv.message}</p>
                    <span className="text-[10px] text-slate-400 block text-right">
                      {selectedConv.createdAt ? new Date(selectedConv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                </div>

                {/* Owner Reply Bubble */}
                {selectedConv.ownerReply && (
                  <div className="flex flex-col items-end space-y-1">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-xs max-w-[85%] font-sans text-xs space-y-1">
                      <div className="font-bold text-[11px] text-blue-200">
                        {selectedConv.owner?.name || 'Property Owner'}
                      </div>
                      <p>{selectedConv.ownerReply}</p>
                      <span className="text-[10px] text-blue-200 block text-right flex items-center justify-end gap-1">
                        {selectedConv.respondedAt ? new Date(selectedConv.respondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        <CheckCheck className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                )}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="text-xs text-slate-400 italic flex items-center gap-1 pl-2">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                    Typing message...
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto">
                <button
                  onClick={() => handleQuickSuggestion('Is the room currently available?')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
                >
                  Is room available?
                </button>
                <button
                  onClick={() => handleQuickSuggestion('What facilities are included?')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
                >
                  What facilities included?
                </button>
                <button
                  onClick={() => handleQuickSuggestion('Can I schedule a visit for tomorrow?')}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap"
                >
                  Schedule visit tomorrow?
                </button>
              </div>

              {/* Message Composer Footer */}
              <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-slate-200 flex items-center gap-2">
                <input
                  type="text"
                  placeholder={user?.role === 'OWNER' ? 'Write a response to seeker...' : 'Enquiry message to owner...'}
                  value={replyText}
                  onChange={handleInputChange}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600"
                />
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  loading={sending}
                  disabled={!replyText.trim()}
                  icon={Send}
                >
                  Send
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-400 font-semibold text-xs">
              Select a conversation thread to view chat history.
            </div>
          )}
        </div>

      </div>

      {/* Report Conversation Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Conversation"
      >
        <form onSubmit={handleReportConversation} className="space-y-4 font-sans text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Reason for Report</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-xs"
            >
              <option value="HARASSMENT">Harassment or Abuse</option>
              <option value="SPAM">Spam or Unsolicited Ads</option>
              <option value="FRAUD">Fraudulent Listing Information</option>
              <option value="SAFETY">Safety Concerns</option>
              <option value="OTHER">Other Issue</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Details</label>
            <textarea
              placeholder="Describe the issue for admin moderation..."
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-blue-600"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" type="button" onClick={() => setIsReportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" type="submit" loading={reportLoading}>
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>

      <Toast isOpen={isToastOpen} onClose={() => setIsToastOpen(false)} message={toastMsg} type={toastType} />

    </Container>
  );
}
