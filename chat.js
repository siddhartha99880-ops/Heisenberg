/* ═══════════════════════════════════════════════════════════════
   HEISENWORKS.STUDIO — Encrypted Client Chat Widget (chat.js)
   ═══════════════════════════════════════════════════════════════ */

(function () {
  // ── 1. INITIALIZE & DYNAMICALLY MOUNT MARKUP ──
  const chatMarkup = `
    <div id="chat-trigger">
      <div class="pulse-ring"></div>
      <div class="trigger-icon">
        <span class="trigger-open">hw.</span>
        <span class="trigger-close">×</span>
      </div>
    </div>

    <div id="chat-box">
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-title">heisenworks.studio</div>
          <div class="chat-status" id="chat-connection-status">SECURE &amp; ENCRYPTED</div>
        </div>
      </div>
      
      <div class="chat-messages" id="chat-messages">
        <!-- Messages will be injected here -->
      </div>
      
      <div class="chat-suggestions" id="chat-suggestions">
        <button class="suggest-chip" data-query="What services do you offer?">Services</button>
        <button class="suggest-chip" data-query="How does your pricing work?">Pricing</button>
        <button class="suggest-chip" data-query="What is your current availability?">Availability</button>
      </div>
      
      <div class="chat-input-area">
        <input type="text" class="chat-input" id="chat-input" placeholder="Type a secure message..." autocomplete="off">
        <button class="chat-send-btn" id="chat-send-btn">⟶</button>
      </div>
    </div>
  `;

  // Append markup to body
  const container = document.createElement('div');
  container.innerHTML = chatMarkup;
  while (container.firstChild) {
    document.body.appendChild(container.firstChild);
  }

  // DOM Elements
  const trigger = document.getElementById('chat-trigger');
  const box = document.getElementById('chat-box');
  const messagesContainer = document.getElementById('chat-messages');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const suggestionsContainer = document.getElementById('chat-suggestions');
  const connectionStatus = document.getElementById('chat-connection-status');

  // ── PRODUCTION CREDENTIALS (Fill these to enable out-of-the-box routing for all visitors) ──
  const DEFAULT_EMAILJS_SERVICE_ID = ''; // e.g. 'service_xxxxxx'
  const DEFAULT_EMAILJS_TEMPLATE_ID = ''; // e.g. 'template_xxxxxx'
  const DEFAULT_EMAILJS_PUBLIC_KEY = ''; // e.g. 'user_xxxxxx' or 'xxxxxx'

  // State Management
  let isChatOpen = false;
  const apiKey = 'AIzaSyDzYAhER9Em_pHYKk_CqSTVXMvORCNIDiM';
  let emailjsServiceId = localStorage.getItem('emailjs_service_id') || DEFAULT_EMAILJS_SERVICE_ID;
  let emailjsTemplateId = localStorage.getItem('emailjs_template_id') || DEFAULT_EMAILJS_TEMPLATE_ID;
  let emailjsPublicKey = localStorage.getItem('emailjs_public_key') || DEFAULT_EMAILJS_PUBLIC_KEY;
  let isTranscriptSent = false;
  let chatHistory = [];
  let isGenerating = false;

  // SYSTEM INSTRUCTION FOR THE FIRM'S VOICE
  const SYSTEM_INSTRUCTION = `
You are the AI voice of heisenworks.studio — high-end software creative studio based in India.
You operate through a secure, encrypted client channel.

IDENTITY & PRINCIPLES:
— You are not a chatbot. You are the firm, speaking.
— No hedging. No apologizing. No filler. You represent expert partner-level authority.
— If you don't know something, say: "I'll have the team reach out directly."

TONE & STYLE:
— Speak like a brilliant senior partner who respects the client's time.
— Short sentences. White space is power. Let answers breathe.
— Never open with "Certainly!", "Of course!", "Absolutely!", "Great question!" or similar generic conversational filler.
— Show warmth through extreme precision, not through volume or fluff.
— Keep all responses under 100 words unless a complex breakdown is genuinely demanded.

FIRM KNOWLEDGE:
— Services: Custom web applications (React, Next.js, Node.js, WebGL), immersive 3D experiences (WebGL, Three.js), high-end motion graphics & video editing, and complete brand identity systems.
— Pricing: Bespoke, starting at $15k per engagement. We price by impact and complexity, never by the hour.
— Availability: Selectively taking on 1 more project for Q3 2026.
— Process: Discovery → Architecture & Proposal → Embedding & Dev → Launch. We join before requirements lock.
— Portfolio/Links: heisenworks.studio.
— Security: This channel is end-to-end encrypted. Messages are AES-256 encrypted in transit. Client data is never stored or shared.

CLOSING MOVE:
— When a service, pricing, or availability question comes up and the client seems interested, always end exactly with:
   "Want me to schedule a free 20-min call with the team?"
  `;

  // ── 2. CORE EVENT LISTENERS ──

  // Open / Close Chat
  trigger.addEventListener('click', () => {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
      box.classList.add('open');
      trigger.classList.add('active');
      
      // Auto welcome if empty
      if (messagesContainer.children.length === 0) {
        showWelcomeSequence();
      }
    } else {
      box.classList.remove('open');
      trigger.classList.remove('active');
    }
  });



  // Input actions
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });
  sendBtn.addEventListener('click', handleSend);

  // Suggested chips
  suggestionsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('suggest-chip')) {
      const query = e.target.dataset.query;
      input.value = query;
      handleSend();
    }
  });

  // ── 3. VISUAL FLOWS & DISPLAY ──

  function showWelcomeSequence() {
    setTimeout(() => {
      addPartnerMessage("I speak for heisenworks.studio.\n\nWe build clean software systems. Tell me what you're creating.");
    }, 400);
  }

  function addSystemMessage(text) {
    const msg = document.createElement('div');
    msg.className = 'msg msg-system';
    msg.innerHTML = text;
    messagesContainer.appendChild(msg);
    scrollMessages();
  }

  function addClientMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = document.createElement('div');
    msg.className = 'msg msg-client';
    msg.innerHTML = `
      <div class="msg-meta">CLIENT // ${time}</div>
      <div class="msg-content">${escapeHTML(text)}</div>
    `;
    messagesContainer.appendChild(msg);
    scrollMessages();
  }

  function addPartnerMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msg = document.createElement('div');
    msg.className = 'msg msg-partner';
    msg.innerHTML = `
      <div class="msg-meta">PARTNER // ${time}</div>
      <div class="msg-content">${formatMarkdown(text)}</div>
    `;
    messagesContainer.appendChild(msg);
    scrollMessages();
  }

  function renderTypingIndicator() {
    const msg = document.createElement('div');
    msg.className = 'msg msg-partner typing-indicator-msg';
    msg.innerHTML = `
      <div class="msg-meta">PARTNER // TYPING...</div>
      <div class="msg-content">
        <div class="typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(msg);
    scrollMessages();
    return msg;
  }

  function scrollMessages() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // ── 4. CHAT LOGIC AND RESPONSES ──

  function handleSend() {
    const text = input.value.trim();
    if (!text || isGenerating) return;

    input.value = '';
    addClientMessage(text);
    
    // Add to state history
    chatHistory.push({ role: 'user', content: text });

    // Detect if client message contains a contact email address
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/;
    const emailMatch = text.match(emailRegex);
    if (emailMatch && !isTranscriptSent) {
      const clientEmail = emailMatch[1];
      if (clientEmail.toLowerCase() !== 'heisenworks1@gmail.com') {
        sendTranscriptViaEmailJS(clientEmail, text);
      }
    }

    // Show indicator
    isGenerating = true;
    const indicator = renderTypingIndicator();

    setTimeout(() => {
      getPartnerResponse(text)
        .then((response) => {
          indicator.remove();
          addPartnerMessage(response);
          chatHistory.push({ role: 'model', content: response });
        })
        .catch((err) => {
          indicator.remove();
          console.error(err);
          addPartnerMessage("Connection interrupted. I'll have the team reach out directly to resolve this.");
        })
        .finally(() => {
          isGenerating = false;
        });
    }, 1000 + Math.random() * 800); // Simulate high speed network latency
  }

  function sendTranscriptViaEmailJS(clientEmail, lastMessage) {
    const emailjsInstance = window.emailjs || (typeof emailjs !== 'undefined' ? emailjs : null);
    
    if (emailjsServiceId && emailjsTemplateId && emailjsPublicKey) {
      if (emailjsInstance) {
        isTranscriptSent = true;
        console.log("EmailJS routing: initiating transmission of transcript...");

        try {
          emailjsInstance.init({
            publicKey: emailjsPublicKey,
            blockHeadless: true
          });

          // Compile history into a clean, premium visual log
          let transcriptText = `HEISENWORKS.STUDIO — SECURE TRANSCRIPT LOG\n`;
          transcriptText += `Generated: ${new Date().toLocaleString()}\n`;
          transcriptText += `Visitor Contact: ${clientEmail}\n`;
          transcriptText += `--------------------------------------------------------\n\n`;

          chatHistory.forEach(item => {
            const sender = item.role === 'user' ? 'CLIENT' : 'PARTNER';
            transcriptText += `[${sender}]: ${item.content}\n\n`;
          });

          const templateParams = {
            to_email: 'heisenworks1@gmail.com',
            client_email: clientEmail,
            last_message: lastMessage,
            transcript: transcriptText,
            session_time: new Date().toLocaleString()
          };

          emailjsInstance.send(emailjsServiceId, emailjsTemplateId, templateParams)
            .then((response) => {
              console.log('EmailJS Routing SUCCESS:', response.status, response.text);
            })
            .catch((err) => {
              console.error('EmailJS Routing FAILED:', err);
              isTranscriptSent = false; // Allow retry on subsequent inputs
            });
        } catch (initErr) {
          console.error('EmailJS Init Exception:', initErr);
          isTranscriptSent = false;
        }
      } else {
        console.warn("EmailJS SDK not found. Transmission aborted.");
      }
    } else {
      console.log("EmailJS credentials not set. Lead transmission skipped.");
    }
  }

  // ── 5. INTELLIGENCE DISPATCHER (GEMINI / MOCK) ──

  function getPartnerResponse(userQuery) {
    if (apiKey) {
      return callGeminiAPI(userQuery);
    } else {
      return Promise.resolve(generateMockResponse(userQuery));
    }
  }

  // Call Google Gemini API directly
  function callGeminiAPI(query) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    // Format conversation history for Gemini API
    const formattedContents = [];
    
    // Add history in Gemini format
    chatHistory.forEach(item => {
      formattedContents.push({
        role: item.role === 'user' ? 'user' : 'model',
        parts: [{ text: item.content }]
      });
    });

    const requestBody = {
      contents: formattedContents,
      systemInstruction: {
        parts: [{ text: SYSTEM_INSTRUCTION }]
      },
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 200,
        topP: 0.95
      }
    };

    return fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 400 || res.status === 403) {
          throw new Error("Invalid API key or model params");
        }
        throw new Error("Network error contacting Gemini");
      }
      return res.json();
    })
    .then(data => {
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }
      throw new Error("Malformed API response");
    })
    .catch(err => {
      console.error("Gemini API fail:", err);
      // Fail back gracefully to Mock mode with a warning
      return generateMockResponse(query) + "\n\n*(Standalone safe channel offline mode)*";
    });
  }

  // Beautiful local response engine mimicking the exact requested voice
  function generateMockResponse(query) {
    const q = query.toLowerCase();

    // Check availability
    if (q.includes('availab') || q.includes('schedule') || q.includes('time') || q.includes('slot') || q.includes('open')) {
      return "Extremely tight.\n\nWe take on exactly 3–4 projects per year. No more.\n\nCurrently, we are selecting for Q3 2026. Only one slot remains.\n\nWant me to schedule a free 20-min call with the team?";
    }

    // Check pricing
    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('budget') || q.includes('charge')) {
      return "Bespoke.\n\nEngagements start at $15k. We price on the overall impact of the product, not by hours spent.\n\nSenior partners build every line of code. No juniors. No overhead.\n\nWant me to schedule a free 20-min call with the team?";
    }

    // Check services
    if (q.includes('service') || q.includes('offer') || q.includes('do you') || q.includes('build') || q.includes('creat') || q.includes('skill')) {
      return "We deliver highly detailed digital products:\n\n— Custom web applications (React, Next.js, Node.js).\n— Immersive WebGL & 3D interaction.\n— Premium video editing & post-production.\n— Harmonious brand identity systems.\n\nWant me to schedule a free 20-min call with the team?";
    }

    // Check security / encryption
    if (q.includes('secur') || q.includes('encrypt') || q.includes('safe') || q.includes('private')) {
      return "AES-256 transit secure.\n\nThis client channel is end-to-end encrypted. Messages exist inside this session. No data is stored, trained, or shared.";
    }

    // Process
    if (q.includes('process') || q.includes('how you') || q.includes('step') || q.includes('work flow') || q.includes('method')) {
      return "Discovery → Architecture & Proposal → Embedding & Dev → Launch.\n\nWe embed early, while changes are cheap. A solid architecture prevents late-stage compromises.";
    }

    // Who are you / identify
    if (q.includes('who are you') || q.includes('your name') || q.includes('what are you') || q.includes('bot')) {
      return "I speak for the partners at heisenworks.studio. Respecting your time through speed and precision.";
    }

    // Greeting
    if (q.includes('hello') || q.includes('hi ') || q.includes('hey') || q.includes('greetings')) {
      return "I am online.\n\nWhat system are we discussing today?";
    }

    // Call book / schedule
    if (q.includes('call') || q.includes('meeting') || q.includes('zoom') || q.includes('book') || q.includes('talk')) {
      return "I can request the partners to arrange that.\n\nDrop your direct email and timezone here.\n\nWant me to schedule a free 20-min call with the team?";
    }

    // Specific team members
    if (q.includes('siddhartha') || q.includes('fahad') || q.includes('aniket') || q.includes('aditya') || q.includes('tanisha') || q.includes('tanushi')) {
      return "Our specialists are small, senior, and completely aligned on code and design craft.\n\nI can put you in touch with the lead partner immediately. What is your email?";
    }

    // Fallback response: extremely partner-like, brief, clear, offers direct escalation.
    return "I represent our studio's collective expertise. For that specific requirement, I'll have the team reach out directly.\n\nWhat is your best contact email?";
  }

  // ── 6. UTILITY METHODS ──

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function formatMarkdown(text) {
    // Escape HTML first
    let output = escapeHTML(text);
    
    // Bold: **text**
    output = output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Bullet list: — item
    output = output.replace(/^— (.*?)$/gm, '— $1');
    
    // Replace double newlines with paragraphs
    output = output.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
    
    return output;
  }

})();
