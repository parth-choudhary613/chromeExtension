/* global chrome */
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [blocklist, setBlocklist] = useState([]);
  const [newSite, setNewSite] = useState("");
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Load blocklist from Chrome storage
    chrome.storage.sync.get(["blocklist", "enabled"], (result) => {
      setBlocklist(result.blocklist || []);
      setEnabled(result.enabled !== false);
    });
  }, []);

  const addSite = () => {
    let formattedSite = newSite.trim();
    if (!formattedSite.startsWith("http://") && !formattedSite.startsWith("https://")) {
      formattedSite = `*://*.${formattedSite}/*`;
    }

    const updatedBlocklist = [...blocklist, formattedSite];
    setBlocklist(updatedBlocklist);
    chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
      console.log("Site added:", formattedSite);
      updateRules();
    });
    setNewSite("");
  };

  const removeSite = (site) => {
    const updatedBlocklist = blocklist.filter((item) => item !== site);
    setBlocklist(updatedBlocklist);
    chrome.storage.sync.set({ blocklist: updatedBlocklist }, () => {
      console.log("Site removed:", site);
      updateRules();
    });
  };

  const toggleExtension = () => {
    const newStatus = !enabled;
    setEnabled(newStatus);
    chrome.storage.sync.set({ enabled: newStatus }, () => {
      console.log("Extension toggled. Enabled:", newStatus);
      updateRules();
    });
  };

  const updateRules = () => {
    chrome.storage.sync.get(["blocklist", "enabled"], (result) => {
      const blocklist = result.blocklist || [];
      const enabled = result.enabled !== false;

      console.log("Updating rules from UI with blocklist:", blocklist, "and enabled:", enabled);

      chrome.declarativeNetRequest.updateDynamicRules(
        {
          removeRuleIds: Array.from({ length: blocklist.length }, (_, index) => index + 1),
          addRules: enabled
            ? blocklist.map((site, index) => ({
                id: index + 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                  urlFilter: site,
                  resourceTypes: ["main_frame"],
                },
              }))
            : [],
        },
        () => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            console.log("Rules updated successfully from UI");
          }
        }
      );
    });
  };

  return (
    <div className="App">
      <h1>Blocked Websites</h1>
      <div>
        <input
          type="text"
          value={newSite}
          onChange={(e) => setNewSite(e.target.value)}
          placeholder="Add a website"
        />
        <button onClick={addSite}>Add</button>
      </div>
      <ul>
        {blocklist.map((site, index) => (
          <li key={index}>
            {site} <button onClick={() => removeSite(site)}>Remove</button>
          </li>
        ))}
      </ul>
      <button onClick={toggleExtension}>
        {enabled ? "Disable" : "Enable"} Extension
      </button>
    </div>
  );
}

export default App;
