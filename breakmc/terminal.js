// I <3 testing in production
document.addEventListener("DOMContentLoaded", () => {
    const outputDiv = document.getElementById("output");
    const API_HOST = localStorage.getItem("apiHost") || "http://localhost:33533";
    let history = [];
    let historyIndex = 0;

    createWelcomeMessage();

    newPrompt();

    // redirect keys to the prompt
    document.addEventListener("keydown", (e) => {
        // ignore modifier keys
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        const activeCommand = document.getElementById("activeCommand");
        if (!activeCommand) return;
        if (document.activeElement !== activeCommand) {
            e.preventDefault();
            activeCommand.focus();
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            // e.preventDefault();
            // let sel = window.getSelection();
            // activeCommand.textContent = activeCommand.textContent.slice(0, sel.anchorOffset) + e.key + activeCommand.textContent.slice(sel.anchorOffset);
            // sel.collapse(activeCommand.firstChild, sel.anchorOffset + 1);

        } else if (e.key === "Backspace") {
            e.preventDefault();
            // activeCommand.textContent = activeCommand.textContent.slice(0, -1);
            let sel = window.getSelection();
            const text = activeCommand.textContent;
            const start = sel.anchorOffset;
            const end = sel.focusOffset;
            const newText = text.slice(0, start - 1) + text.slice(end);
            activeCommand.textContent = newText;
            sel.collapse(activeCommand.firstChild, start - 1);

        }
    });

    function moveCursorToEnd(el) {
        // const range = document.createRange();
        // const sel = window.getSelection();
        // range.selectNodeContents(el);
        // range.collapse(false);
        // sel.removeAllRanges();
        // sel.addRange(range);
    }


    document.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "l") {
            // dang browser, stop stealing my ctrl+l
            clearTerminal();
            newPrompt()
        } else if (event.ctrlKey && event.key === "c") {
            const activeCommand = document.getElementById("activeCommand");
            if (activeCommand) {
                activeCommand.textContent = "";
            }
        }
    });


    function newPrompt() {
        const promptLine = document.createElement("div");
        promptLine.classList.add("prompt-line");

        const promptContainer = document.createElement("span");
        promptContainer.classList.add("prompt");

        const userSpan = document.createElement("span");
        userSpan.classList.add("user");
        userSpan.textContent = "breakmc";

        const atSpan = document.createElement("span");
        atSpan.classList.add("at");
        atSpan.textContent = "@";

        const hostSpan = document.createElement("span");
        hostSpan.classList.add("host");
        hostSpan.textContent = API_HOST;

        const colonSpan = document.createElement("span");
        colonSpan.classList.add("colon");
        colonSpan.textContent = ":";

        const tildeSpan = document.createElement("span");
        tildeSpan.classList.add("tilde");
        tildeSpan.textContent = "~";

        const dollarSpan = document.createElement("span");
        dollarSpan.classList.add("dollar");
        dollarSpan.textContent = "$ ";

        promptContainer.appendChild(userSpan);
        promptContainer.appendChild(atSpan);
        promptContainer.appendChild(hostSpan);
        promptContainer.appendChild(colonSpan);
        promptContainer.appendChild(tildeSpan);
        promptContainer.appendChild(dollarSpan);

        const commandSpan = document.createElement("span");
        commandSpan.classList.add("command");
        commandSpan.id = "activeCommand";
        commandSpan.contentEditable = true;
        commandSpan.spellcheck = false;

        promptLine.appendChild(promptContainer);
        promptLine.appendChild(commandSpan);
        outputDiv.appendChild(promptLine);
        scrollToBottom();
        commandSpan.focus();

        commandSpan.addEventListener("paste", (event) => {
            event.preventDefault();
            const text = (event.clipboardData || window.clipboardData).getData("text");
            document.execCommand("insertText", false, text);
        });

        commandSpan.addEventListener("keydown", async (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                let command = commandSpan.textContent.trim();
                commandSpan.contentEditable = false;
                commandSpan.removeAttribute("id");
                if (command === "") return newPrompt();

                // clean up the command
                console.log("Original command: \"", command, "\"");
                command = command.replace(/[\u200B-\u200D\uFEFF]/g, ""); // remove zero-width spaces
                console.log("After removing zero-width spaces: \"", command, "\"");

                // remove spaces at the beginning and end
                command = command.trim();
                console.log("After trimming spaces: \"", command, "\"");

                // only take text content
                command = command.replace(/<div>/g, "\n");
                console.log("After replacing <div> with newline: \"", command, "\"");

                console.log("Final command: \"", command, "\"");

                history.push(command);
                historyIndex = history.length;

                if (command.toLowerCase() === "clear") {
                    clearTerminal();
                    return newPrompt();
                }

                if (command.toLowerCase().startsWith("sethost")) {
                    const newHost = command.split(" ")[1];
                    if (newHost) {
                        if (newHost.startsWith("http://") || newHost.startsWith("https://")) {
                            localStorage.setItem("apiHost", newHost);
                            return location.reload();
                        } else {
                            addLine("Error: Invalid host. Must start with http:// or https://");
                            console.log("invalid host: ", newHost);
                            return newPrompt();
                        }
                    } else {
                        addLine("Error: No host provided. Usage: sethost <url>");
                        return newPrompt();
                    }
                }

                try {
                    const response = await fetch(`${API_HOST}/api/cmd`, {
                        method: "POST",
                        headers: { "Content-Type": "text/plain" },
                        body: command
                    });
                    const data = await response.json();
                    const message = data.message || "";
                    addLine(message);
                } catch (error) {
                    const errorMessage = "Error: Failed to send request. (Is BreakMC running, and do the host's match?)";
                    const hint1 = "Hint: You can set your host with the sethost command.";
                    addLine(errorMessage);
                    addLine(hint1);
                    console.error("Failed to send request: ", error);
                }
                newPrompt();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    commandSpan.textContent = history[historyIndex];
                }

                // move cursor to the end
                moveCursorToEnd(commandSpan);
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    commandSpan.textContent = history[historyIndex];
                } else {
                    historyIndex = history.length;
                    commandSpan.textContent = "";
                }

                // move cursor to the end
                moveCursorToEnd(commandSpan);
            }
        });
    }

    function addLine(text) {
        const line = document.createElement("div");
        line.classList.add("line");
        line.textContent = text;
        outputDiv.appendChild(line);
        scrollToBottom();
    }

    function createWelcomeMessage() {
        const welcomeMessage = [
            "Welcome to the BreakMC Web Terminal",
            "Type 'help' to get a list of available commands.",
        ];
        welcomeMessage.forEach((line) => addLine(line));
    }

    function clearTerminal() {
        outputDiv.innerHTML = "";
        history = [];
        historyIndex = 0;
    }

    function scrollToBottom() {
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }
});

// ex: https://mrbreaknfix.com/terminal.html?api=http://localhost:33533
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has("api")) {
    const newHost = urlParams.get("api");
    localStorage.setItem("apiHost", newHost);
    urlParams.delete("api");
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, document.title, newUrl);
    location.reload();
}