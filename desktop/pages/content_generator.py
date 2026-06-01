from PyQt6.QtWidgets import *
from PyQt6.QtCore import *
from PyQt6.QtGui import *
from desktop.api_client import *
import random

class ContentGeneratorPage(QWidget):
    page_title = "Content Generator"

    def __init__(self):
        super().__init__()
        self.setObjectName("contentGeneratorPage")
        layout = QVBoxLayout(self)
        layout.setContentsMargins(24, 24, 24, 24)
        layout.setSpacing(16)

        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setObjectName("contentArea")
        scroll.setFrameShape(QFrame.Shape.NoFrame)
        scroll_widget = QWidget()
        sl = QVBoxLayout(scroll_widget)
        sl.setContentsMargins(0, 0, 0, 0)
        sl.setSpacing(16)

        title = QLabel("Content Generator")
        title.setObjectName("titleLabel")
        sl.addWidget(title)

        input_layout = QHBoxLayout()
        self.keyword_input = QLineEdit()
        self.keyword_input.setPlaceholderText("Enter keyword or topic...")
        self.tone_combo = QComboBox()
        self.tone_combo.addItems(["Viral", "Educational", "Entertainment", "Inspirational", "Controversial"])
        self.generate_btn = QPushButton("Generate Content")
        self.generate_btn.setObjectName("btnPrimary")
        self.generate_btn.clicked.connect(self.generate)
        input_layout.addWidget(self.keyword_input)
        input_layout.addWidget(QLabel("Tone:"))
        input_layout.addWidget(self.tone_combo)
        input_layout.addWidget(self.generate_btn)
        sl.addLayout(input_layout)

        self.tab_widget = QTabWidget()
        self.tabs = {}
        for tab_name in ["Titles", "Script", "Description", "Hashtags", "Hooks", "CTAs"]:
            tab = QWidget()
            tab_layout = QVBoxLayout(tab)
            list_widget = QListWidget()
            list_widget.setObjectName("contentList")
            copy_btn = QPushButton(f"Copy All {tab_name}")
            copy_btn.setObjectName("btnAccent")
            copy_btn.clicked.connect(lambda checked, n=tab_name: self.copy_tab(n))
            tab_layout.addWidget(list_widget)
            tab_layout.addWidget(copy_btn)
            self.tabs[tab_name] = list_widget
            self.tab_widget.addTab(tab, tab_name)
        sl.addWidget(self.tab_widget)

        scroll.setWidget(scroll_widget)
        layout.addWidget(scroll)

    def generate(self):
        keyword = self.keyword_input.text().strip() or "trending topic"
        tone = self.tone_combo.currentText()
        self.generate_btn.setEnabled(False)
        self.generate_btn.setText("Generating...")
        QTimer.singleShot(100, lambda: self._run_generate(keyword, tone))

    def _run_generate(self, keyword, tone):
        result = ai_generate('ideas', f"{keyword} ({tone})")
        if 'error' in result:
            self.set_demo_data(keyword, tone)
        else:
            self.set_generated_data(result, keyword, tone)
        self.generate_btn.setEnabled(True)
        self.generate_btn.setText("Generate Content")

    def set_generated_data(self, data, keyword, tone):
        text = data.get('text', '')
        if text:
            lines = [l.strip() for l in text.split('\n') if l.strip() and len(l.strip()) > 3]
            self.tabs["Titles"].clear()
            for l in lines[:10]:
                self.tabs["Titles"].addItem(l)
        else:
            self.set_demo_data(keyword, tone)

    def set_demo_data(self, keyword, tone):
        titles = [
            f"{keyword}: The Complete Guide for 2026",
            f"10 {keyword} Tips You Need to Know",
            f"Why {keyword} Is Exploding Right Now",
            f"I Tried {keyword} for 30 Days, Here's What Happened",
            f"The TRUTH About {keyword} Nobody Talks About",
        ]
        self.tabs["Titles"].clear()
        for t in titles:
            self.tabs["Titles"].addItem(t)

        script = f"[HOOK] Did you know {keyword} is changing everything?\n[INTRO] Today we'll explore the complete landscape of {keyword}...\n[MAIN] Point 1: The rise of {keyword}\nPoint 2: How to leverage {keyword}\nPoint 3: Future predictions\n[OUTRO] Like and subscribe for more {keyword} content!"
        self.tabs["Script"].clear()
        for line in script.split('\n'):
            self.tabs["Script"].addItem(line)

        desc = f"In this video, we dive deep into {keyword}. Whether you're a beginner or expert, you'll find valuable insights.\n\nWhat you'll learn:\n- The fundamentals of {keyword}\n- Advanced strategies\n- Pro tips and tricks\n\n# {keyword} #trending #viral #tutorial #2026"
        self.tabs["Description"].clear()
        self.tabs["Description"].addItem(desc)

        hashtags = [f"#{keyword.replace(' ','')}", "#trending", "#viral", "#tutorial", "#2026", "#howto", "#tips", "#guide", f"#{keyword[:15].replace(' ','')}Tips", "#explore"]
        self.tabs["Hashtags"].clear()
        for h in hashtags:
            self.tabs["Hashtags"].addItem(h)

        hooks = [
            f"Stop scrolling! This {keyword} video will change your mind...",
            f"{keyword} is NOT what you think. Here's why...",
            f"I can't believe nobody told you this about {keyword}...",
            f"The {keyword} secret that will save you hours...",
        ]
        self.tabs["Hooks"].clear()
        for h in hooks:
            self.tabs["Hooks"].addItem(h)

        ctas = [
            "Like this video if you found it helpful!",
            "Subscribe for more content like this!",
            "Comment below your thoughts on {keyword}!",
            "Share this with someone who needs to know about {keyword}!",
        ]
        self.tabs["CTAs"].clear()
        for c in ctas:
            self.tabs["CTAs"].addItem(c)

    def copy_tab(self, tab_name):
        widget = self.tabs.get(tab_name)
        if not widget:
            return
        texts = []
        for i in range(widget.count()):
            texts.append(widget.item(i).text())
        cb = QApplication.clipboard()
        cb.setText('\n'.join(texts))
