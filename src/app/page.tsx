'use client'

import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  return (
    <main className="bg-ink text-cream min-h-screen flex flex-col">
      <style jsx global>{`
        @keyframes ra-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes ra-pulse-ring {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .ra-dot-wrap { position: relative; display: inline-flex; align-items: center; justify-content: center; width: 10px; height: 10px; }
        .ra-dot-core { width: 8px; height: 8px; background: #FFD93D; animation: ra-pulse 1.6s ease-in-out infinite; }
        .ra-dot-ring { position: absolute; inset: 0; border-radius: 50%; background: #FFD93D; animation: ra-pulse-ring 1.6s ease-out infinite; }
      `}</style>

      <nav className="flex items-center justify-between px-5 md:px-10 py-4 border-b border-cream/10 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow flex items-center justify-center">
              <div className="w-2 h-2 bg-ink"></div>
            </div>
            <span className="text-sm font-medium">restock alerts</span>
          </div>
          <div className="hidden md:inline-flex items-stretch border border-cream/20 ml-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-yellow/[0.08] border-r border-cream/20 text-[10px] font-medium tracking-[0.18em] text-yellow">
              <span className="ra-dot-wrap" style={{ width: '8px', height: '8px' }}>
                <span className="ra-dot-ring"></span>
                <span className="ra-dot-core" style={{ width: '6px', height: '6px' }}></span>
              </span>
              LIVE
            </div>
            <div className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium tracking-[0.18em] text-cream2">
              7 UK RETAILERS
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/pricing" className="text-sm text-cream2 hover:text-cream">Pricing</Link>
          <Link href="/signin" className="text-sm text-cream2 hover:text-cream">Sign in</Link>
          <Link
            href="/signup"
            className="bg-yellow text-ink px-4 py-2 text-sm font-medium border-[1.5px] border-ink"
            style={{ boxShadow: '2px 2px 0 #1A1623' }}
          >
            Start free
          </Link>
        </div>

        <div className="md:hidden text-xs tracking-[0.14em] text-mute">MENU</div>
      </nav>

      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-8 md:pt-12 pb-8 md:pb-12 w-full flex-1 flex flex-col">
        <div className="md:grid md:grid-cols-[1.15fr_0.85fr] md:gap-16 md:items-center flex-1">

          <div>
            <div className="md:hidden inline-flex items-stretch border border-cream/20 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow/[0.08] border-r border-cream/20 text-xs font-medium tracking-[0.18em] text-yellow">
                <span className="ra-dot-wrap">
                  <span className="ra-dot-ring"></span>
                  <span className="ra-dot-core"></span>
                </span>
                LIVE
              </div>
              <div className="inline-flex items-center px-3 py-1 text-xs font-medium tracking-[0.18em] text-cream2">
                7 UK RETAILERS
              </div>
            </div>

            <h1
              className="font-display uppercase tracking-tight text-7xl leading-[0.86] md:text-[128px] md:leading-[0.88]"
              style={{ textShadow: '0 4px 0 rgba(0,0,0,0.45)' }}
            >
              <span className="md:hidden">CATCH<br/>EVERY<br/></span>
              <span className="hidden md:inline">CATCH EVERY<br/></span>
              <span
                className="text-yellow"
                style={{ textShadow: '0 4px 0 rgba(0,0,0,0.55)' }}
              >
                DROP.
              </span>
            </h1>

            <p className="text-sm md:text-base uppercase tracking-wide font-medium text-cream2 max-w-xs md:max-w-md leading-relaxed mt-7 md:mt-10">
              UK Pokémon TCG restocks. Caught the second they hit. No more refresh tabs.
            </p>

            <div className="mt-7 md:mt-10">
              <Link
                href="/signup"
                className="bg-yellow text-ink px-5 py-4 font-medium border-[1.5px] border-ink flex items-center justify-between w-full md:inline-flex md:w-auto md:gap-8 md:px-7"
                style={{ boxShadow: '3px 3px 0 #1A1623' }}
              >
                <span>START FREE</span>
                <span>→</span>
              </Link>
              <p className="mt-3 text-[11px] text-mute tracking-wider text-center md:text-left">
                3 FREE · £4.99 UNLIMITED · NO CARD TO START
              </p>
            </div>
          </div>

          <div className="mt-10 md:mt-0">
            <div className="aspect-[4/5] md:aspect-[3/4] bg-surface border border-cream/15 flex flex-col items-center justify-center p-5 text-center relative max-w-[440px] mx-auto md:mx-0 md:ml-auto">
              <div className="absolute top-3.5 left-3.5 text-[9px] tracking-[0.18em] text-mute">FIG. 01</div>
              <div className="absolute top-3.5 right-3.5 text-[9px] tracking-[0.18em] text-mute">★</div>
              <div className="absolute bottom-3.5 left-3.5 text-[9px] tracking-[0.18em] text-mute">/</div>
              <div className="absolute bottom-3.5 right-3.5 text-[9px] tracking-[0.18em] text-mute">/</div>

              <div className="w-8 h-px bg-cream/20 mb-5"></div>
              <div className="text-base md:text-lg font-medium mb-1.5">Your ETB photo</div>
              <div className="text-xs text-mute max-w-[220px]">Real product render lives here.</div>
              <div className="w-8 h-px bg-cream/20 mt-5"></div>
            </div>
          </div>

        </div>
      </div>

      <section className="px-5 md:px-10 py-3.5 border-t border-cream/10 flex items-center gap-3.5 text-xs tracking-[0.14em] text-mute overflow-hidden whitespace-nowrap">
        <span className="text-yellow">●</span>
        <span>CHAOS CARDS</span>
        <span className="w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span>SMYTHS</span>
        <span className="w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span>ARGOS</span>
        <span className="w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span>MAGIC MADHOUSE</span>
        <span className="w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span>AMAZON UK</span>
        <span className="w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span className="hidden md:inline">POKÉMON CENTER</span>
        <span className="hidden md:inline w-1 h-1 bg-yellow flex-shrink-0"></span>
        <span>+6 MORE</span>
      </section>
    </main>
  )
}
