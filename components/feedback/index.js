import React, { useState } from "react";

const FeedbackButton = ({ googleFormLink }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
    >
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          backgroundColor: "#007BFF",
          color: "#FFF",
          border: "none",
          borderRadius: "5px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0px 0px 10px rgba(0, 123, 255, 0.5)",
        }}
      >
        Feedback
      </button>

      {showForm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "90vw",
              height: "90vh",
              background: "#fff",
              borderRadius: "8px",
              boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
              overflow: "auto",
            }}
          >
            {/* Check if googleFormLink is provided. If yes, embed it. Otherwise, provide a link to open it in a new tab */}
            {googleFormLink ? (
              <iframe
                src={googleFormLink}
                width="100%"
                height="100%"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
              >
                Loading…
              </iframe>
            ) : (
              <a
                href={googleFormLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Feedback Form
              </a>
            )}
            <button
              onClick={() => setShowForm(false)}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "#DC3545",
                color: "#FFF",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackButton;
