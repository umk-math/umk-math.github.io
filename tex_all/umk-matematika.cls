% ============================================
% УМК «Математика строит будущее»
% Класс документа
% Автор: Станулевич А.В., ГГКСТ
% ============================================
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{umk-matematika}[2026/01/15 v1.0 УМК Математика]

\LoadClass[12pt,a4paper]{article}

\RequirePackage[utf8]{inputenc}
\RequirePackage[T2A]{fontenc}
\RequirePackage[russian]{babel}
\RequirePackage[top=2cm, bottom=2cm, left=2.5cm, right=2cm]{geometry}
\RequirePackage{amsmath,amssymb}
\RequirePackage{xcolor}
\RequirePackage{fancyhdr}
\RequirePackage{lastpage}
\RequirePackage{hyperref}
\RequirePackage{titlesec}

\definecolor{gold}{HTML}{D4A017}

\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\small УМК Математика строит будущее}
\fancyhead[R]{\small Станулевич А.В.}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.5pt}

\hypersetup{colorlinks=true,linkcolor=black,urlcolor=blue}

\newcommand{\maketitlepage}[3]{
    \thispagestyle{empty}
    \begin{center}
        \vspace*{2cm}
        {\Large\bfseries Министерство образования Республики Беларусь}\\[5pt]
        {\large Гродненский государственный колледж строительных технологий}
        \vspace{1.5cm}
        {\Huge\bfseries\color{gold} Математика строит будущее}
        \vspace{1cm}
        {\Large\bfseries #1}\\[0.5cm]
        {\large #2}
        \vfill
        {\normalsize Гродно, 2026}
    \end{center}
    \newpage
}

\titleformat{\section}{\Large\bfseries\color{gold}}{}{0em}{}

\endinput