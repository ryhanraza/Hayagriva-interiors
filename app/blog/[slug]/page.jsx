'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, User, ArrowRight, BookOpen } from 'lucide-react'
import { getArticleBySlug } from '../../../data/articles'

export default function ArticlePage() {
  const params = useParams()
  const article = getArticleBySlug(params.slug)

  if (!article) {
    return (
      <div className="min-h-screen bg-warmcream flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-serif font-bold text-charcoal">Article Not Found</h1>
        <p className="text-charcoal/60 text-sm">The article you are looking for does not exist.</p>
        <Link
          href="/about#journal"
          className="px-8 py-3 bg-charcoal hover:bg-gold text-white hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Design Journal</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-warmcream text-charcoal min-h-screen overflow-x-hidden">

      {/* Hero / Header */}
      <section className="relative bg-charcoal text-white overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Link
              href="/about#journal"
              className="inline-flex items-center gap-2 text-beige/60 hover:text-gold text-xs font-semibold uppercase tracking-widest transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to Design Journal</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
              <span className="px-3 py-1.5 bg-gold/20 border border-gold/30 text-gold rounded-full">
                {article.category}
              </span>
              <span className="text-beige/40">{article.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif leading-[1.2] font-extrabold text-white">
              {article.title}
            </h1>

            <p className="text-beige/60 text-sm leading-relaxed max-w-2xl">
              {article.desc}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-beige/40">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gold" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gold" />
                <span>{article.readTime}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="max-w-4xl mx-auto px-6 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative h-[300px] sm:h-[420px] w-full rounded-[2rem] overflow-hidden border border-charcoal/10 shadow-2xl"
        >
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </motion.div>
      </section>

      {/* Article Body */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {article.sections.map((section, idx) => (
            <motion.div
              key={section.heading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.05 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4">
                <span className="shrink-0 mt-1 w-8 h-8 rounded-full bg-charcoal text-gold flex items-center justify-center text-xs font-bold">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="space-y-4 flex-1">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-charcoal">
                    {section.heading}
                  </h2>
                  <p className="text-sm sm:text-base text-charcoal/60 leading-[1.8]">
                    {section.body}
                  </p>
                </div>
              </div>
              {idx < article.sections.length - 1 && (
                <div className="border-b border-charcoal/5 ml-12" />
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-charcoal text-white rounded-[2rem] p-10 sm:p-14 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gold/15 via-transparent to-transparent pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <BookOpen size={28} className="mx-auto text-gold" />
            <h3 className="text-2xl sm:text-3xl font-serif font-bold">Enjoyed This Article?</h3>
            <p className="text-beige/60 text-sm max-w-md mx-auto leading-relaxed">
              Explore more of our design insights or schedule a consultation to bring these ideas into your home.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <Link
                href="/about#journal"
                className="px-7 py-3 border border-white/20 hover:border-gold text-white hover:text-gold font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 flex items-center gap-2"
              >
                <span>More Articles</span>
                <ArrowRight size={12} />
              </Link>
              <Link
                href="/contact"
                className="px-7 py-3 bg-gold hover:bg-white text-charcoal hover:text-charcoal font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-500 shadow-lg shadow-gold/20"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}
