CYBERPUNK_QSS = """
/* ── Global ── */
QWidget {
    background-color: #0B0B0F;
    color: #FFFFFF;
    font-family: 'Segoe UI', 'Inter', sans-serif;
    font-size: 12px;
}
QMainWindow { background-color: #0B0B0F; border: none; }

/* ── Sidebar ── */
#sidebar {
    background-color: rgba(18, 18, 26, 0.95);
    border-right: 1px solid rgba(0, 191, 255, 0.15);
    min-width: 200px; max-width: 200px;
}
#sidebar QPushButton {
    background: transparent;
    color: rgba(255,255,255,0.5);
    border: none;
    border-radius: 6px;
    padding: 10px 14px;
    text-align: left;
    font-size: 12px;
}
#sidebar QPushButton:hover {
    background: rgba(0, 255, 240, 0.05);
    color: rgba(255,255,255,0.8);
}
#sidebar QPushButton:checked {
    background: rgba(0, 255, 240, 0.08);
    color: #00FFF0;
    border-left: 2px solid #00FFF0;
}
#sidebar QPushButton:pressed { background: rgba(0, 255, 240, 0.12); }
#sidebar #logoLabel {
    font-family: 'Orbitron', 'Segoe UI', monospace;
    font-size: 16px; font-weight: 700;
    color: #00FFF0; padding: 16px 14px 8px;
}

/* ── Content Area ── */
#contentArea {
    background-color: #0B0B0F;
}

/* ── Cards ── */
Card {
    background: rgba(18, 18, 26, 0.85);
    border: 1px solid rgba(255, 255, 255, 0.04);
    border-radius: 10px;
    padding: 16px;
}
Card:hover {
    border: 1px solid rgba(0, 191, 255, 0.15);
}
#cardTitle {
    font-size: 13px; font-weight: 600;
    color: rgba(255,255,255,0.85);
}
#cardValue {
    font-size: 28px; font-weight: 700;
}
#cardLabel {
    font-size: 10px; color: rgba(255,255,255,0.4);
    text-transform: uppercase; letter-spacing: 1px;
}

/* ── Inputs ── */
QLineEdit, QTextEdit, QPlainTextEdit {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 10px 14px;
    color: #FFFFFF;
    font-size: 13px;
    selection-background-color: rgba(0, 191, 255, 0.3);
}
QLineEdit:focus, QTextEdit:focus, QPlainTextEdit:focus {
    border: 1px solid rgba(0, 191, 255, 0.3);
    background: rgba(0, 191, 255, 0.03);
}
QLineEdit::placeholder { color: rgba(255,255,255,0.2); }

/* ── Buttons ── */
QPushButton {
    background: rgba(0, 191, 255, 0.08);
    color: #00BFFF;
    border: 1px solid rgba(0, 191, 255, 0.15);
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 12px; font-weight: 600;
}
QPushButton:hover {
    background: rgba(0, 191, 255, 0.15);
    border: 1px solid rgba(0, 191, 255, 0.3);
}
QPushButton:pressed {
    background: rgba(0, 191, 255, 0.2);
}
QPushButton#btnPrimary {
    background: linear-gradient(135deg, #00BFFF, #8A5CFF);
    color: #FFFFFF;
    border: none;
}
QPushButton#btnPrimary:hover {
    background: linear-gradient(135deg, #33CCFF, #9B6CFF);
}
QPushButton#btnAccent {
    background: rgba(255, 45, 149, 0.12);
    color: #FF2D95;
    border: 1px solid rgba(255, 45, 149, 0.2);
}
QPushButton#btnAccent:hover {
    background: rgba(255, 45, 149, 0.2);
}
QPushButton:disabled {
    opacity: 0.4;
    background: rgba(255,255,255,0.02);
    color: rgba(255,255,255,0.2);
}

/* ── Tabs ── */
QTabWidget::pane {
    background: transparent;
    border: none;
}
QTabBar::tab {
    background: transparent;
    color: rgba(255,255,255,0.4);
    border: none;
    padding: 8px 16px;
    font-size: 11px;
    border-bottom: 2px solid transparent;
}
QTabBar::tab:selected {
    color: #00FFF0;
    border-bottom: 2px solid #00FFF0;
}
QTabBar::tab:hover {
    color: rgba(255,255,255,0.7);
}

/* ── Progress Bars ── */
QProgressBar {
    background: rgba(255,255,255,0.04);
    border: none;
    border-radius: 4px;
    height: 6px;
    text-align: center;
    font-size: 0px;
}
QProgressBar::chunk {
    border-radius: 4px;
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
        stop:0 #00BFFF, stop:0.5 #8A5CFF, stop:1 #FF2D95);
}

/* ── Scrollbars ── */
QScrollBar:vertical {
    background: transparent;
    width: 6px;
}
QScrollBar::handle:vertical {
    background: rgba(255,255,255,0.08);
    border-radius: 3px;
    min-height: 30px;
}
QScrollBar::handle:vertical:hover { background: rgba(255,255,255,0.15); }
QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical { height: 0; }

/* ── ComboBox ── */
QComboBox {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 8px;
    padding: 8px 14px;
    color: #FFFFFF;
    font-size: 12px;
}
QComboBox:hover {
    border: 1px solid rgba(0, 191, 255, 0.2);
}
QComboBox::drop-down {
    border: none;
    width: 30px;
}
QComboBox QAbstractItemView {
    background: rgba(18, 18, 26, 0.95);
    border: 1px solid rgba(0, 191, 255, 0.15);
    border-radius: 6px;
    selection-background-color: rgba(0, 191, 255, 0.15);
    color: #FFFFFF;
    padding: 4px;
}

/* ── Lists ── */
QListWidget, QListWidget QScrollBar:vertical {
    background: transparent;
    border: none;
}
QListWidget::item {
    background: rgba(255,255,255,0.02);
    border-radius: 6px;
    padding: 10px;
    margin: 2px 0;
}
QListWidget::item:hover {
    background: rgba(255,255,255,0.04);
}
QListWidget::item:selected {
    background: rgba(0, 191, 255, 0.08);
    color: #00BFFF;
}

/* ── Labels ── */
QLabel#glowText {
    color: #00FFF0;
    font-size: 14px;
}
QLabel#mutedText {
    color: rgba(255,255,255,0.3);
    font-size: 10px;
}
QLabel#scoreLabel {
    font-size: 36px; font-weight: 700;
}
QLabel#titleLabel {
    font-size: 16px; font-weight: 700;
    color: #FFFFFF;
}
QLabel#subtitleLabel {
    font-size: 11px; color: rgba(255,255,255,0.4);
}

/* ── Chat ── */
#chatUser {
    background: rgba(0, 191, 255, 0.08);
    border: 1px solid rgba(0, 191, 255, 0.1);
    border-radius: 12px 12px 4px 12px;
    padding: 10px 14px;
    color: #FFFFFF;
}
#chatAI {
    background: rgba(138, 92, 255, 0.08);
    border: 1px solid rgba(138, 92, 255, 0.1);
    border-radius: 12px 12px 12px 4px;
    padding: 10px 14px;
    color: rgba(255,255,255,0.85);
}

/* ── Splitter ── */
QSplitter::handle {
    background: rgba(255,255,255,0.04);
    width: 1px;
}

/* ── Tooltips ── */
QToolTip {
    background: rgba(18, 18, 26, 0.95);
    border: 1px solid rgba(0, 191, 255, 0.2);
    border-radius: 6px;
    color: #FFFFFF;
    padding: 8px 12px;
    font-size: 11px;
}
"""

def apply_theme(app):
    app.setStyleSheet(CYBERPUNK_QSS)
