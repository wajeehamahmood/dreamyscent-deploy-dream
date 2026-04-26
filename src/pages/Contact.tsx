import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { submitContact } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || name.length > 100) return toast({ title: "Enter a valid name", variant: "destructive" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return toast({ title: "Enter a valid email", variant: "destructive" });
    if (!message || message.length > 1000) return toast({ title: "Enter a message (max 1000 chars)", variant: "destructive" });

    setSubmitting(true);
    try {
      await submitContact({ name, email, message });
      toast({ title: "✨ Message sent", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl bg-white/70 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition";

  return (
    <section className="px-4 sm:px-8 pt-10 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-10 animate-fade-up">
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Get in Touch</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-semibold mb-3">
            Let's <span className="text-gradient italic">Talk</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Have a question, custom order, or just want to say hello? We'd love to hear from you.
          </p>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          <aside className="space-y-4">
            {[
              { icon: Mail, title: "Email", value: "hello@dreamscents.com" },
              { icon: Phone, title: "Phone", value: "+1 (555) 010-2024" },
              { icon: MapPin, title: "Boutique", value: "12 Rue des Rêves, Paris" },
            ].map((c) => (
              <div key={c.title} className="glass rounded-2xl p-5 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center shrink-0">
                  <c.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.title}</p>
                  <p className="font-medium mt-0.5">{c.value}</p>
                </div>
              </div>
            ))}
          </aside>

          <form onSubmit={onSubmit} className="lg:col-span-2 glass-strong rounded-3xl p-6 sm:p-10 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Message</label>
              <textarea
                rows={6}
                className={inputCls + " resize-none"}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
              />
              <p className="text-xs text-muted-foreground mt-1 text-right">{form.message.length}/1000</p>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-dream rounded-full px-8 py-3 font-medium inline-flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Sending…" : (<><Send className="w-4 h-4" /> Send Message</>)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;