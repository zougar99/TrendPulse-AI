import React, { useState } from "react"
import { motion } from "framer-motion"

type Tone = "Viral" | "Educational" | "Entertainment" | "Inspirational" | "Controversial"
type Tab = "Titles" | "Script" | "Description" | "Hashtags" | "Thumbnail Ideas" | "Hooks" | "CTAs"

interface GeneratedContent {
  Titles: string[]
  Script: string[]
  Description: string[]
  Hashtags: string[]
  "Thumbnail Ideas": string[]
  Hooks: string[]
  CTAs: string[]
}

const TONES: Tone[] = ["Viral", "Educational", "Entertainment", "Inspirational", "Controversial"]

const DEMO_CONTENT: Record<Tone, GeneratedContent> = {
  Viral: {
    Titles: ["You Won't Believe What AI Just Did!", "This AI Tool is Going VIRAL in 2026", "I Tried 100 AI Tools So You Don't Have To"],
    Script: ["Open with a shocking statistic about AI adoption rates in 2026.\n\nCut to quick montage of viral AI tools in action.\n\nShow side-by-side comparisons with before/after results.\n\nEnd with a challenge for viewers to try it themselves."],
    Description: ["In this video, I'm showing you the most viral AI tools of 2026 that are taking the internet by storm. From content creation to automation, these tools will blow your mind.\n\n🚀 Tools Mentioned:\n1. TrendPulse AI\n2. AI Content Studio\n3. Viral Generator\n\n🔥 Subscribe for more AI content!"],
    Hashtags: ["#AIViral", "#TrendPulse", "#AITools2026", "#ViralContent", "#AINews", "#FutureOfAI", "#TechTrends", "#AIRevolution"],
    "Thumbnail Ideas": ["Face with shocked expression + glowing AI brain background + red VIRAL text overlay", "Split screen: BEFORE (boring) vs AFTER (amazing) with arrow", "AI robot holding a trending sign with bold yellow text"],
    Hooks: ["This changes everything about content creation.", "I've never seen anything like this before.", "Stop what you're doing and watch this."],
    CTAs: ["Subscribe for weekly AI insights!", "Share this with someone who needs to see it.", "Comment your favorite AI tool below!"],
  },
  Educational: {
    Titles: ["How AI is Transforming Content Creation in 2026", "The Complete Guide to AI-Powered Marketing", "AI Explained: What Every Creator Needs to Know"],
    Script: ["Welcome to this comprehensive guide on AI-powered content creation.\n\nIn this video, we'll cover:\n1. Understanding AI fundamentals\n2. Practical applications for creators\n3. Step-by-step implementation\n\nLet's dive deep into each concept."],
    Description: ["A complete breakdown of how AI is revolutionizing content creation in 2026. Perfect for beginners and advanced creators alike.\n\n📚 Chapters:\n0:00 - Introduction\n2:30 - AI Basics\n5:00 - Practical Applications\n8:00 - Case Studies\n\n✅ Enroll in our free AI course: link.com"],
    Hashtags: ["#AIEducation", "#LearnAI", "#ContentStrategy", "#DigitalMarketing", "#AITutorial", "#CreatorTips", "#TechEducation"],
    "Thumbnail Ideas": ["Clean whiteboard style with AI diagram and you presenting", "Split brain half human/half circuit board", "Book-style thumbnail: 'AI 101' with clean typography"],
    Hooks: ["Here's what nobody tells you about AI content creation.", "By the end of this video, you'll know exactly how to use AI.", "Let me break this down in simple terms."],
    CTAs: ["Save this video for later reference!", "Download the free resource guide below.", "Join our learning community."],
  },
  Entertainment: {
    Titles: ["AI Tries to Make a Movie... It Gets WEIRD", "I Let AI Control My Channel for a Week", "The Funniest AI Generated Content Ever"],
    Script: ["Today we're doing something completely different.\n\nWe're going to let AI take control and see what happens.\n\nSpoiler alert: it gets chaotic.\n\nLet's see what AI has in store for us today!"],
    Description: ["Things got CRAZY when I let AI take over my channel for a day. From auto-generated scripts to AI thumbnails, nothing went as planned.\n\n😂 Watch till the end for the biggest fail!\n\n👕 Merch: merchlink.com"],
    Hashtags: ["#AIFunny", "#AIExperiment", "#ContentCreatorLife", "#AIFails", "#ViralVideo", "#ComedyGold", "#AIChallenge"],
    "Thumbnail Ideas": ["Your face with an 'oh no' expression + AI robot making mischief behind", "Split personality - half you/half AI version of you", "Movie poster parody with 'AI: THE MOVIE' in bold"],
    Hooks: ["You won't believe what happened next.", "This is the most ridiculous thing I've ever done.", "What could possibly go wrong?"],
    CTAs: ["Hit that like button if you laughed!", "Tag a friend who needs to see this.", "Subscribe for more AI chaos!"],
  },
  Inspirational: {
    Titles: ["How I Built a 6-Figure Channel Using AI", "From Zero to Hero: My AI-Powered Journey", "The Future of Creativity is HERE and It's Beautiful"],
    Script: ["I remember when I started my journey with zero followers.\n\nToday, I want to share how AI tools transformed my creative process and helped me build a thriving community.\n\nThis isn't just about technology — it's about human potential."],
    Description: ["A personal story of transformation through AI-powered content creation. If I can do it, you can too.\n\n💡 Key Takeaways:\n- Start before you're ready\n- Consistency beats perfection\n- Let AI handle the boring stuff\n\n✨ Subscribe for weekly inspiration!"],
    Hashtags: ["#Inspiration", "#CreatorJourney", "#AITransformation", "#DreamBig", "#ContentCreator", "#SuccessStory", "#Motivation"],
    "Thumbnail Ideas": ["You pointing confidently into the future with city skyline", "Then vs Now comparison with inspirational quote overlay", "Golden hour aesthetic with 'YOUR STORY STARTS NOW' text"],
    Hooks: ["Your story isn't finished yet.", "The best time to start was yesterday. The second best time is now.", "Someone out there needs to hear what you have to say."],
    CTAs: ["Start your journey today - link in description.", "Share your story in the comments.", "Subscribe to grow with our community."],
  },
  Controversial: {
    Titles: ["Is AI Killing Creativity or Saving It?", "The Dark Side of AI Content Creation", "Why I Quit Using AI (And Why You Should Too)"],
    Script: ["This might ruffle some feathers, but someone has to say it.\n\nAI is changing content creation in ways we don't fully understand yet.\n\nI'm going to show you both sides of the argument because this matters."],
    Description: ["The controversial truth about AI in content creation that no one is talking about. I'm breaking my silence on what I've discovered.\n\n⚠️ Warning: This video contains opinions that may challenge your views.\n\n🔍 Sources cited: link.com\n\nLet's have an honest conversation."],
    Hashtags: ["#Controversial", "#AIDebate", "#ContentCreator", "#AIEthics", "#DigitalFuture", "#HonestTalk", "#UnpopularOpinion"],
    "Thumbnail Ideas": ["Your serious face with bold red 'THE TRUTH' text", "Scale tipping - creativity vs automation with fire background", "Dark moody shot with 'AI: GOOD OR BAD?' in neon text"],
    Hooks: ["I'm about to say something controversial.", "Everyone is wrong about AI.", "This might get me cancelled, but I don't care."],
    CTAs: ["Form your own opinion - research both sides.", "Respectful debate welcome in the comments.", "Subscribe to stay open-minded."],
  },
}

export function ContentGenerator() {
  const [keyword, setKeyword] = useState("")
  const [tone, setTone] = useState<Tone>("Viral")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<GeneratedContent | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>("Titles")

  const tabs: Tab[] = ["Titles", "Script", "Description", "Hashtags", "Thumbnail Ideas", "Hooks", "CTAs"]

  const generate = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    try {
      const response = await chrome.runtime.sendMessage({
        type: "GENERATE_CONTENT",
        payload: { keyword: keyword.trim(), tone },
      })
      if (response?.content) {
        setContent(response.content)
      } else {
        setContent(DEMO_CONTENT[tone])
      }
    } catch {
      setContent(DEMO_CONTENT[tone])
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="trendpulse-content-generator">
      <style>{`
        .trendpulse-gen-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }
        .trendpulse-gen-tone-select {
          padding: 10px 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 10px;
          color: #fff;
          font-size: 11px;
          font-family: inherit;
          outline: none;
          cursor: pointer;
          min-width: 110px;
        }
        .trendpulse-gen-tone-select:focus {
          border-color: #8A5CFF;
        }
        .trendpulse-gen-tone-select option { background: #0B0B0F; color: #fff; }
        .trendpulse-gen-tabs {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 8px;
        }
        .trendpulse-gen-tab {
          padding: 5px 10px;
          border: none;
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
          font-size: 9px;
          font-family: inherit;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .trendpulse-gen-tab.active {
          background: rgba(138,92,255,0.15);
          color: #8A5CFF;
          box-shadow: 0 0 10px rgba(138,92,255,0.1);
        }
        .trendpulse-gen-cards {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .trendpulse-gen-card {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.04);
          border-radius: 8px;
        }
        .trendpulse-gen-card-text {
          flex: 1;
          font-size: 11px;
          line-height: 1.5;
          color: rgba(255,255,255,0.75);
          white-space: pre-wrap;
        }
        .trendpulse-gen-copy-btn {
          padding: 4px 10px;
          border: none;
          background: rgba(0,191,255,0.1);
          color: #00BFFF;
          font-size: 9px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
          font-family: inherit;
        }
        .trendpulse-gen-copy-btn:hover {
          background: rgba(0,191,255,0.2);
        }
        .trendpulse-gen-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          gap: 8px;
        }
        .trendpulse-gen-loading-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #8A5CFF;
        }
      `}</style>
      <div className="trendpulse-section-title">✍ Auto Content Generator</div>
      <div className="trendpulse-gen-input-row">
        <input
          className="trendpulse-input"
          placeholder="Enter a keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <select
          className="trendpulse-gen-tone-select"
          value={tone}
          onChange={(e) => setTone(e.target.value as Tone)}
        >
          {TONES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <motion.button
        className="trendpulse-btn trendpulse-btn-accent"
        onClick={generate}
        disabled={loading || !keyword.trim()}
        whileTap={{ scale: 0.95 }}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {loading ? (
          <span className="trendpulse-gen-loading">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="trendpulse-gen-loading-dot"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </span>
        ) : "Generate"}
      </motion.button>
      {content && (
        <>
          <div className="trendpulse-gen-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`trendpulse-gen-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="trendpulse-gen-cards">
            {content[activeTab]?.map((item, i) => (
              <motion.div
                key={i}
                className="trendpulse-gen-card"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <div className="trendpulse-gen-card-text">{item}</div>
                <button
                  className="trendpulse-gen-copy-btn"
                  onClick={() => copyToClipboard(item)}
                >
                  Copy
                </button>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
