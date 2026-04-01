import { useState } from 'react';
import { Link } from 'react-router-dom';
import { fiveFasts } from '../data/dowithoutFasts';

export default function DoWithout() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6">DoWithoutChallenge</h1>
          <p className="text-xl lg:text-2xl text-primary-400 mb-4 font-medium">
            One thing less, one day a month.
          </p>
          <p className="text-lg lg:text-xl text-gray-300">
            Try to Do Without for a day to appreciate it more.
          </p>
        </div>
      </section>

      {/* Discipline Gallery — single horizontal row */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin">
            {fiveFasts.map((fast, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`flex-shrink-0 snap-start rounded-lg p-5 text-left transition border-2 cursor-pointer
                  w-56
                  ${activeTab === index
                    ? 'border-primary-500 bg-primary-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
              >
                <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mb-2
                  ${activeTab === index
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600'
                  }`}>
                  {fast.day}
                </span>
                <h3 className="text-base font-bold text-gray-900 mb-1">{fast.name}</h3>
                <p className="text-xs text-gray-500 font-mono">{fast.hashtag}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Motivation Tab Content */}
      <section className="pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                {fiveFasts[activeTab].day}
              </span>
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-mono">
                {fiveFasts[activeTab].hashtag}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {fiveFasts[activeTab].name}
            </h3>
            <p className="text-primary-600 italic mb-6">{fiveFasts[activeTab].tagline}</p>
            <p className="text-gray-700 text-lg leading-relaxed mb-8">
              {fiveFasts[activeTab].motivation}
            </p>

            {/* Progression steps */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Your progression</p>
              <ol className="space-y-3">
                {fiveFasts[activeTab].progression.map((step, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <span className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${i === 0
                        ? 'bg-primary-600 text-white'
                        : i === fiveFasts[activeTab].progression.length - 1
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                      {i + 1}
                    </span>
                    <span className={`text-gray-700 pt-0.5 ${i === fiveFasts[activeTab].progression.length - 1 ? 'font-medium text-green-800' : ''}`}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* What is the Do Without Challenge? */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What is the Do Without Challenge?</h2>
          <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              It is an act of will, a practice of your freedom muscle, a way to a balanced life.
            </p>
            <p>
              All of the things we "Do Without" are good and useful, but we often grow overly
              dependent on them and they become our trap.
            </p>
            <p className="text-gray-900 font-semibold text-xl">
              One day is just the start.
            </p>
            <p>
              The first day without is not the goal — it's the mirror. It shows you the
              dependency. The headache by 10am. The hand reaching for the phone. The evening
              that feels strangely empty. That's data. That's honest.
            </p>
            <p>
              From there, you decide. Maybe it's fewer cups, not zero. Maybe it's cycling
              to work twice a week instead of driving every day. Maybe it's one screen-free
              evening, or saving that glass of wine for when it actually means something.
            </p>
            <p>
              We're not asking you to give things up. We're asking you to find the balance
              where these things serve you again — instead of the other way around.
            </p>
            <p className="text-gray-900 font-medium">
              Start with one day. See what you notice. Then choose your own pace.
            </p>
          </div>
        </div>
      </section>

      {/* Rules — This is not a competition */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">This is not a competition. It's a community.</h2>
          <div className="space-y-4 text-lg text-gray-700 max-w-2xl mx-auto">
            <p>
              There is no leaderboard. There is no streak. There are no points.
            </p>
            <p>
              DoWithoutChallenge is a practice of awareness, not performance. The only person
              keeping score is you, and the only question that matters is the honest one:
            </p>
            <p className="text-gray-900 font-medium italic text-xl">
              What did I reach for today that I could have done without?
            </p>
          </div>
        </div>
      </section>

      {/* Retro Chatroom */}
      {/* TODO: embed chatroom component here */}
      <section className="py-16 bg-gray-900 text-green-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border border-green-800 rounded-lg p-8 font-mono bg-black/50">
            <div className="flex items-center gap-2 mb-6 border-b border-green-800 pb-4">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              <span className="ml-4 text-green-600 text-sm">DoWithout://chatroom</span>
            </div>

            <h2 className="text-2xl font-bold mb-4 text-green-300">{'>'} The Chatroom</h2>
            <p className="text-green-500 mb-6 leading-relaxed">
              A single retro, anonymous, ongoing, permanent, and by-topic chat.
              Share what brought you here and what you've gotten out of it.
              Give others the true testimonials they might need when they land here.
            </p>

            <div className="flex flex-wrap gap-2 mb-8">
              {fiveFasts.map((fast, index) => (
                <span
                  key={index}
                  className="border border-green-700 text-green-400 px-3 py-1 rounded text-sm hover:bg-green-900/50 transition cursor-default"
                >
                  {fast.hashtag}
                </span>
              ))}
            </div>

            <div className="space-y-3 text-sm text-green-600 border-t border-green-800 pt-6">
              <p><span className="text-green-400">anon_42:</span> First #decaf Thursday. Had a headache by 10am. That told me everything I needed to know.</p>
              <p><span className="text-green-400">walker_7:</span> #nocar Wednesday — cycled to the shop. Noticed a bakery I've driven past for 3 years.</p>
              <p><span className="text-green-400">quiet_one:</span> #nogenai Friday. Wrote actual code for the first time in weeks. Felt rusty. Then felt alive.</p>
              <p className="text-green-800 mt-4">// TODO: embed live chatroom component</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Attribution */}
      <section className="py-8 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-500">
            A{' '}
            <Link to="/" className="text-primary-600 hover:text-primary-700 transition font-medium">
              72Others
            </Link>{' '}
            challenge. Part of the Route 72 community.
          </p>
        </div>
      </section>
    </div>
  );
}
