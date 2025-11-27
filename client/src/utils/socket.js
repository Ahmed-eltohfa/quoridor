// socket.js
import { io } from "socket.io-client";
import NotifyX from "notifyx";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";
function showGameInvite(playerName, onAccept, onDecline) {
    Confirm.show(
        "Game Invite",
        `${playerName} invited you to a game!`,
        "Accept",
        "Decline",
        () => {
            if (onAccept) onAccept();
        },
        () => {
            if (onDecline) onDecline();
        }
    );
}

let authToken = null;

export const socket = io(import.meta.env.VITE_BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

const eventBus = new EventTarget();
eventBus.on = (name, fn) => eventBus.addEventListener(name, (e) => fn(e.detail));
eventBus.off = (name, fn) => eventBus.removeEventListener(name, fn);
eventBus.emit = (name, data) => eventBus.dispatchEvent(new CustomEvent(name, { detail: data }));

socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
    if (authToken) socket.emit("register", { token: authToken });
});

socket.on("reconnect", (attempt) => {
    console.log("Reconnected after", attempt, "attempt(s)");
    if (authToken && socket.connected) socket.emit("register", { token: authToken });
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    NotifyX.info("Realtime connection lost");
    eventBus.emit("socket:disconnect", { reason });
});

// forward important events to the app via eventBus and show lightweight notifications
const forward = (evt, busName = evt, notify = null, message = null) => {
    socket.on(evt, (payload) => {
        if (evt === "invite:received") {
            showGameInvite(
                payload.from.username || "Unknown Player",
                () => {
                    // socket.emit("invite:respond", { inviteId: payload.inviteId, accept: true });
                    console.log("Accepted invite:", payload.inviteId);
                },
                () => {
                    // socket.emit("invite:respond", { inviteId: payload.inviteId, accept: false });
                    console.log("Declined invite:", payload.inviteId);
                }
            );
        }
        if (notify === "info") NotifyX.info(payload?.message || message || `${evt} received`);
        else if (notify === "success") NotifyX.success(payload?.message || message || `${evt} received`);
        else if (notify === "error") NotifyX.error(payload?.message || message || `${evt} received`);
        eventBus.emit(busName, payload);
    });
};

forward("invite:received", "invite:received", "info");
forward("invite:send:result", "invite:send:result");
forward("invite:accepted", "invite:accepted", "success");
forward("register:success", "register:success", "success", "Connected to realtime server");
forward("register:failed", "register:failed", "error");
forward("invite:rejected", "invite:rejected");
forward("invite:expired", "invite:expired");
forward("invite:cancelled", "invite:cancelled");
forward("invite:rejected", "invite:rejected");
forward("invite:accepted", "invite:accepted");
forward("invite:respond:result", "invite:respond:result");

forward("opponentDisconnected", "opponentDisconnected");

export function setAuthToken(token) {
    authToken = token;
    if (token && socket && socket.connected) {
        socket.emit("register", { token });
    }
}


export { eventBus };