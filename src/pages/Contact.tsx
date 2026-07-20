import { Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section className="bg-background pt-28 pb-24">
      <div className="container max-w-2xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl font-light md:text-5xl">Get in touch</h1>
        <p className="mt-4 text-muted-foreground">
          Questions about a stay? Send us a message and we'll get back to you.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-3 rounded-lg bg-card p-5 shadow-soft">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:hello@dunanatura.com" className="text-sm hover:text-primary">
              hello@dunanatura.com
            </a>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-card p-5 shadow-soft">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Mon – Fri: 9am – 5pm</span>
          </div>
        </div>

        <form
          className="mt-10 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thanks! This is a demo form.");
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              required
              placeholder="Name"
              className="rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder="Email"
              className="rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <textarea
            required
            rows={5}
            placeholder="Message"
            className="w-full rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button className="rounded-md bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
