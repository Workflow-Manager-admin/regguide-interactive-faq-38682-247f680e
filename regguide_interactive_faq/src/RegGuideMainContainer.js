import React, { useState } from 'react';

// Inline styles for light theme using the provided color palette
const COLORS = {
  primary: '#0052CC',
  secondary: '#F4F5F7',
  accent: '#36B37E',
  background: '#FFFFFF',
  card: '#F9FAFB',
  text: '#222B45',
  border: '#E0E3EB',
  cost: '#E87A41'
};

const ICON_DOC = (
  <span style={{ display: 'inline-block', marginRight: 8, color: COLORS.primary }} aria-label="document">📄</span>
);

// EXAMPLE dynamic content ----
// In a full application these would load from backend or config.
const QUESTIONS = [
  {
    key: 'regType',
    question: 'What type of registration are you interested in?',
    options: [
      { value: 'new', label: 'Register a new company' },
      { value: 'branch', label: 'Register a branch/overseas company' },
      { value: 'sole', label: 'Register as a sole proprietor' }
    ]
  },
  {
    key: 'businessType',
    question: 'What is the main activity of your business?',
    options: [
      { value: 'consulting', label: 'Consulting/Services' },
      { value: 'trading', label: 'Trading/Import-Export' },
      { value: 'manufacturing', label: 'Manufacturing' }
    ]
  },
  {
    key: 'residency',
    question: 'Are you based locally or overseas?',
    options: [
      { value: 'local', label: 'Local' },
      { value: 'overseas', label: 'Overseas' }
    ]
  }
];

const FAQ_DB = {
  new: [
    {
      question: 'How long does it take to register a new company?',
      answer: 'Usually 2-3 working days if all documents are in order.',
    },
    {
      question: 'What is the minimum capital required?',
      answer: 'The minimum paid-up capital required is typically $1, but may vary by sector.',
    }
  ],
  branch: [
    {
      question: 'What documents are required for a branch registration?',
      answer: 'You need to provide a notarized Certificate of Incorporation and company constitution.',
    }
  ],
  sole: [
    {
      question: 'Can a foreigner register as a sole proprietor?',
      answer: 'Overseas individuals have extra requirements, such as appointing a local manager.',
    }
  ],
};

const DOCS_CHECKLIST = {
  new: [
    { type: 'ID', name: 'Director\'s ID card or passport', required: true, icon: ICON_DOC },
    { type: 'Address Proof', name: 'Registered office address document', required: true, icon: ICON_DOC },
    { type: 'Cost', name: 'Govt. Registration Fee', cost: 315, required: true }
  ],
  branch: [
    { type: 'Document', name: 'Certificate of Incorporation (notarized)', required: true, icon: ICON_DOC },
    { type: 'Document', name: 'Company Constitution', required: true, icon: ICON_DOC },
    { type: 'Cost', name: 'Govt. Branch Fee', cost: 400, required: true }
  ],
  sole: [
    { type: 'ID', name: 'Owner\'s ID card or passport', required: true, icon: ICON_DOC },
    { type: 'Cost', name: 'Sole Proprietor Registration Fee', cost: 60, required: true }
  ]
};

const ISSUED_DOCS = {
  new: [
    { name: 'Certificate of Incorporation', validity: 'Permanent' },
    { name: 'Company Business Profile', validity: 'Up to date when downloaded' }
  ],
  branch: [
    { name: 'Certificate of Registration (Branch)', validity: 'Permanent' }
  ],
  sole: [
    { name: 'Business Registration Certificate', validity: 'Valid for 1 year' }
  ]
};


// PUBLIC_INTERFACE
function RegGuideMainContainer() {
  /**
   * Main container component for the RegGuide Interactive FAQ.
   * Provides guided question flow, dynamic FAQ/checklist, progressive disclosure,
   * and summary display post-registration.
   */

  // Track state of answers, step progress, FAQ/checklist visibility
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [showPanels, setShowPanels] = useState(false);

  // To toggle collapse/expand for FAQ and checklist panels
  const [faqOpen, setFaqOpen] = useState(true);
  const [checklistOpen, setChecklistOpen] = useState(false);
  const [issuedOpen, setIssuedOpen] = useState(false);

  // Derived scenario key from answers (default to 'new')
  const scenarioKey = answers.regType || 'new';

  // PUBLIC_INTERFACE
  function handleOptionSelect(qKey, value) {
    // Update answer for current question and advance
    setAnswers(prev => ({ ...prev, [qKey]: value }));
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setShowPanels(true); // All questions answered, reveal FAQ and checklist
    }
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setAnswers({});
    setStep(0);
    setShowPanels(false);
    setFaqOpen(true);
    setChecklistOpen(false);
    setIssuedOpen(false);
  }

  // Get FAQ, checklist, issued docs for revealed panels
  const faqs = FAQ_DB[scenarioKey] || [];
  const checklist = DOCS_CHECKLIST[scenarioKey] || [];
  const issued = ISSUED_DOCS[scenarioKey] || [];

  // Progress indicator
  const progress = Math.round((step) / QUESTIONS.length * 100);

  return (
    <div
      style={{
        background: COLORS.secondary,
        minHeight: '100vh',
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Progress bar / header */}
      <div style={{
        height: 6,
        background: COLORS.secondary,
        width: '100%',
        margin: 0,
        zIndex: 99,
        position: 'sticky',
        top: 0
      }}>
        <div
          style={{
            width: `${showPanels ? 100 : progress}%`,
            height: '100%',
            transition: 'width 0.5s',
            background: COLORS.primary
          }}
        />
      </div>

      <div style={{
        maxWidth: 480,
        margin: '0 auto',
        marginTop: 32,
        marginBottom: 32,
        padding: '16px',
        width: '100%',
      }}>
        { !showPanels ? (
          <>
            <div
              style={{
                background: COLORS.background,
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(50,70,120,0.08)',
                padding: 24,
                marginBottom: 24,
                textAlign: 'center',
                border: `1px solid ${COLORS.border}`
              }}
            >
              { step === 0 && (
                <>
                  <div style={{ fontWeight: 600, color: COLORS.primary, fontSize: 18, marginBottom: 4 }}>
                    Welcome to RegGuide Interactive FAQ
                  </div>
                  <div style={{ color: COLORS.text, fontSize: 15, marginBottom: 10 }}>
                    Let’s find out what documents, costs, and FAQs apply to your registration scenario.
                  </div>
                </>
              )}

              {/* Guided Question */}
              <div style={{ fontSize: 17, color: COLORS.text, fontWeight: 500, margin: '24px 0 8px 0' }}>
                {QUESTIONS[step].question}
              </div>
              <div>
                {QUESTIONS[step].options.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => handleOptionSelect(QUESTIONS[step].key, opt.value)}
                    className="btn"
                    style={{
                      background: COLORS.primary,
                      color: 'white',
                      borderRadius: 8,
                      fontSize: 16,
                      fontWeight: 500,
                      padding: '10px 24px',
                      margin: '6px 0',
                      width: '100%',
                      border: 'none',
                      marginBottom: 10,
                      boxShadow: '0 1px 4px rgba(20,30,60,0.06)'
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {step > 0 && (
                <div style={{ marginTop: 16 }}>
                  <button
                    className="btn"
                    style={{
                      background: COLORS.accent,
                      color: 'white',
                      borderRadius: 8,
                      padding: '8px 20px',
                      border: 'none',
                      fontWeight: 400,
                      fontSize: 14
                    }}
                    onClick={() => setStep(step-1)}
                  >
                    ← Back
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Show FAQ, checklist, and issued docs
          <>
            <div
              style={{
                background: COLORS.background,
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(50,70,120,0.08)',
                padding: 24,
                marginBottom: 20,
                border: `1px solid ${COLORS.border}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
                <div style={{
                  fontWeight: 600,
                  color: COLORS.primary,
                  fontSize: 18,
                  flex: 1
                }}>
                  Summary For: <span style={{ color: COLORS.accent }}>{scenarioLabel(answers.regType)}</span>
                </div>
                <button
                  onClick={handleRestart}
                  className="btn"
                  style={{
                    background: COLORS.accent,
                    color: 'white',
                    borderRadius: 6,
                    fontWeight: 400,
                    fontSize: 13,
                    padding: '5px 12px',
                    border: 'none',
                    marginLeft: 12
                  }}
                >Start Over</button>
              </div>

              {/* FAQ Collapsible Panel */}
              <Panel
                title="FAQ - Frequently Asked Questions"
                open={faqOpen}
                setOpen={setFaqOpen}
                icon={<span aria-label="FAQ" style={{fontSize: 20, marginRight: 8}}>❓</span>}
                color={COLORS.primary}
              >
                <FaqList faqs={faqs}/>
              </Panel>

              {/* Checklist Collapsible Panel */}
              <Panel
                title="Document Checklist & Fees"
                open={checklistOpen}
                setOpen={setChecklistOpen}
                icon={<span aria-label="Checklist" style={{fontSize: 20, marginRight: 8}}>📋</span>}
                color={COLORS.accent}
              >
                <Checklist checklist={checklist}/>
              </Panel>

              {/* Issued Documents Panel */}
              <Panel
                title="Issued Documents Summary"
                open={issuedOpen}
                setOpen={setIssuedOpen}
                icon={<span aria-label="Issued" style={{fontSize: 20, marginRight: 8}}>✅</span>}
                color={COLORS.primary}
              >
                <IssuedDocs issued={issued}/>
              </Panel>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Helper components below
function scenarioLabel(regType) {
  if (regType === 'branch') return 'Branch/Overseas Company';
  if (regType === 'sole') return 'Sole Proprietor';
  return 'New Company';
}

function Panel({ title, open, setOpen, children, icon, color }) {
  // Collapsible panel for sections (FAQ, Checklist...)
  return (
    <div style={{
      borderRadius: 10,
      background: '#fff',
      margin: '18px 0',
      border: `1.7px solid ${color}`,
      boxShadow: open ? '0 1px 6px rgba(50,70,120,0.06)' : 'none',
      transition: 'box-shadow 0.2s'
    }}>
      <button
        aria-expanded={open}
        aria-controls={title.replace(/\W/g,'')}
        style={{
          width: '100%',
          padding: '13px 16px',
          background: 'none',
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          color,
          fontSize: 16,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          outline: 'none',
        }}
        onClick={() => setOpen(v => !v)}
      >
        {icon} {title}
        <span style={{flex: 1}} />
        <span aria-label={open ? 'Collapse' : 'Expand'} style={{fontSize: 18}}>
          {open ? '▾' : '▸'}
        </span>
      </button>
      {open && <div id={title.replace(/\W/g,'')} style={{padding: '8px 18px 12px 20px', background: COLORS.secondary}}>
        {children}
      </div>}
    </div>
  );
}

function FaqList({ faqs }) {
  // List of FAQ items
  if (!faqs.length) return <div style={{color: COLORS.text}}>No FAQ items.</div>;
  return (
    <ul style={{listStyle: 'none', padding:0, margin:0}}>
      {faqs.map((f,i) => (
        <li key={i} style={{marginBottom: 13}}>
          <div style={{fontWeight: 500, color: COLORS.primary, marginBottom: 2}}>{f.question}</div>
          <div style={{color: COLORS.text}}>{f.answer}</div>
        </li>
      ))}
    </ul>
  );
}

function Checklist({ checklist }) {
  // Document checklist with color-coded cost tags and icons
  if (!checklist.length) return <div style={{color: COLORS.text}}>No checklist items.</div>;
  return (
    <ul style={{listStyle: 'none', padding:0, margin:0}}>
      {checklist.map((item, i) => (
        <li key={i} style={{
          marginBottom: 11,
          display: 'flex',
          alignItems: 'center'
        }}>
          {item.icon && <span>{item.icon}</span>}
          <span style={{
            fontWeight: 500,
            color: COLORS.text,
            marginRight: 5,
            minWidth: 110
          }}>{item.name}</span>
          {item.cost ? (
            <span style={{
              background: COLORS.cost,
              color: 'white',
              fontSize: 13,
              borderRadius: 4,
              padding: '2px 8px',
              marginLeft: 8
            }}>${item.cost}</span>
          ) : null}
          <span style={{marginLeft: 8, color: COLORS.accent, fontSize: 13, fontWeight: 400}}>
            {item.required ? "Required" : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function IssuedDocs({ issued }) {
  // Summary of issued docs
  if (!issued.length) return <div style={{color: COLORS.text}}>No issued documents.</div>;
  return (
    <ul style={{listStyle: 'none', padding:0, margin:0}}>
      {issued.map((doc, i) => (
        <li key={i} style={{
          marginBottom: 9,
          display: 'flex',
          alignItems: 'center'
        }}>
          <span role="img" aria-label="doc" style={{marginRight: 7, fontSize: 15}}>📃</span>
          <span style={{
            fontWeight: 500,
            color: COLORS.text,
            marginRight: 13
          }}>{doc.name}</span>
          <span style={{
            background: COLORS.primary,
            color: 'white',
            borderRadius: 6,
            fontSize: 12,
            padding: '2px 10px'
          }}>{doc.validity}</span>
        </li>
      ))}
    </ul>
  );
}

export default RegGuideMainContainer;
