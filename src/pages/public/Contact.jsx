import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import Container from '../../components/common/Container';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Toast from '../../components/common/Toast';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Get in Touch with PGFinder
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
              Have a question about a PG listing, owner registration, or platform feedback? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Contact Info */}
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Email Us</h4>
                  <p className="text-xs text-slate-500">support@pgfinder.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB]">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Call Helpline</h4>
                  <p className="text-xs text-slate-500">+91 1800 123 4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-50 text-[#2563EB]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A]">Office Location</h4>
                  <p className="text-xs text-slate-500">Sector 62, Noida, Uttar Pradesh 201309</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Your Name"
                  placeholder="Enter full name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Textarea
                  label="How can we help you?"
                  rows={4}
                  required
                  placeholder="Write your query or feedback..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button type="submit" variant="primary" fullWidth icon={Send}>
                  Send Message
                </Button>
              </form>
            </div>

          </div>

        </div>
      </Container>

      <Toast
        isOpen={submitted}
        onClose={() => setSubmitted(false)}
        message="Thank you! Your message has been sent successfully."
        type="success"
      />
    </div>
  );
}
