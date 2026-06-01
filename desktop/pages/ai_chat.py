from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class AIChatPage(QWidget):
    page_title = "AI Chat"

    def __init__(self):
        super().__init__()
        self.setObjectName("aiChatPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        header = QHBoxLayout()
        title = QLabel("AI Chat")
        title.setObjectName("titleLabel")
        header.addWidget(title)
        header.addStretch()
        self.clear_btn = QPushButton("Clear Chat")
        self.clear_btn.setObjectName("btnAccent")
        self.clear_btn.clicked.connect(self.clear_chat)
        header.addWidget(self.clear_btn)
        layout.addLayout(header)

        self.chat_scroll = QScrollArea()
        self.chat_scroll.setWidgetResizable(True)
        self.chat_scroll.setObjectName("contentArea")
        self.chat_scroll.setFrameShape(QFrame.Shape.NoFrame)
        self.chat_container = QWidget()
        self.chat_layout = QVBoxLayout(self.chat_container)
        self.chat_layout.setSpacing(8)
        self.chat_layout.addStretch()
        self.chat_scroll.setWidget(self.chat_container)
        layout.addWidget(self.chat_scroll)

        input_layout = QHBoxLayout()
        self.chat_input = QLineEdit()
        self.chat_input.setPlaceholderText("Ask TrendPulse AI anything...")
        self.chat_input.returnPressed.connect(self.send_message)
        self.send_btn = QPushButton("Send")
        self.send_btn.setObjectName("btnPrimary")
        self.send_btn.clicked.connect(self.send_message)
        input_layout.addWidget(self.chat_input)
        input_layout.addWidget(self.send_btn)
        layout.addLayout(input_layout)

        self.add_ai_message("Hello! I'm TrendPulse AI. Ask me about content strategy, trends, keywords, or anything else to help grow your channel.")
        self.loading_label = None

    def send_message(self):
        text = self.chat_input.text().strip()
        if not text:
            return
        self.add_user_message(text)
        self.chat_input.clear()
        self.send_btn.setEnabled(False)
        self.show_loading()
        QTimer.singleShot(500, lambda: self.get_ai_response(text))

    def get_ai_response(self, text):
        result = ai_generate('chat', text)
        self.hide_loading()
        response = result.get('text', "I'm analyzing your query. Based on current trends, I'd recommend focusing on high-velocity keywords with low competition. Try starting with long-tail variations of your main topic.")
        self.add_ai_message(response)
        self.send_btn.setEnabled(True)
        QTimer.singleShot(100, self.scroll_to_bottom)

    def add_user_message(self, text):
        bubble = QLabel(text)
        bubble.setWordWrap(True)
        bubble.setObjectName("chatUser")
        bubble.setMaximumWidth(400)
        bubble.setStyleSheet("background: rgba(0,191,255,0.08); border: 1px solid rgba(0,191,255,0.1); border-radius: 12px 12px 4px 12px; padding: 10px 14px; color: white;")
        msg_widget = QWidget()
        ml = QHBoxLayout(msg_widget)
        ml.setContentsMargins(0, 0, 0, 0)
        ml.addStretch()
        ml.addWidget(bubble)
        self.chat_layout.insertWidget(self.chat_layout.count() - 1, msg_widget)

    def add_ai_message(self, text):
        bubble = QLabel(text)
        bubble.setWordWrap(True)
        bubble.setObjectName("chatAI")
        bubble.setMaximumWidth(400)
        bubble.setStyleSheet("background: rgba(138,92,255,0.08); border: 1px solid rgba(138,92,255,0.1); border-radius: 12px 12px 12px 4px; padding: 10px 14px; color: rgba(255,255,255,0.85);")
        msg_widget = QWidget()
        ml = QHBoxLayout(msg_widget)
        ml.setContentsMargins(0, 0, 0, 0)
        ml.addWidget(bubble)
        ml.addStretch()
        self.chat_layout.insertWidget(self.chat_layout.count() - 1, msg_widget)

    def show_loading(self):
        self.loading_label = QLabel("TrendPulse AI is thinking...")
        self.loading_label.setStyleSheet("color: rgba(255,255,255,0.4); font-size: 11px; padding: 8px;")
        msg_widget = QWidget()
        ml = QHBoxLayout(msg_widget)
        ml.setContentsMargins(0, 0, 0, 0)
        ml.addWidget(self.loading_label)
        ml.addStretch()
        self.chat_layout.insertWidget(self.chat_layout.count() - 1, msg_widget)

    def hide_loading(self):
        if self.loading_label:
            parent = self.loading_label.parent()
            if parent:
                self.chat_layout.removeWidget(parent)
                parent.deleteLater()
            self.loading_label = None

    def clear_chat(self):
        while self.chat_layout.count() > 1:
            item = self.chat_layout.takeAt(0)
            if item and item.widget():
                item.widget().deleteLater()
        self.add_ai_message("Chat cleared. How can I help you?")

    def scroll_to_bottom(self):
        self.chat_scroll.verticalScrollBar().setValue(self.chat_scroll.verticalScrollBar().maximum())
