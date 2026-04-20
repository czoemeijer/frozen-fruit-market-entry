\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{thesis}[2026/04/19 v1.0 Diplomová práce – Panevropská univerzita]

\RequirePackage{iftex}

\newif\if@print \@printfalse
\DeclareOption{print}{\@printtrue}

\ProcessOptions\relax

% Rozložení stránky
\if@print
  \LoadClass[12pt,twoside,a4paper]{book}
  \RequirePackage[inner=3cm,outer=2cm,top=3cm,bottom=2cm]{geometry}
\else
  \LoadClass[12pt,oneside,a4paper]{book}
  \RequirePackage[margin=2cm,left=3cm,top=3cm,bottom=2cm]{geometry}
\fi

\RequirePackage{graphicx}
\RequirePackage{tabularx}

% LuaLaTeX / XeLaTeX: nativní UTF-8 + fonty
\ifPDFTeX
  % pdfTeX – uživatel musí načíst inputenc/fontenc sám
\else
  \RequirePackage{fontspec}
  \defaultfontfeatures{Ligatures=TeX}
  \setmainfont{Libertinus Serif}
  \setsansfont{Libertinus Sans}[Scale=MatchLowercase]
  \setmonofont{Libertinus Mono}[Scale=MatchLowercase]
\fi

\RequirePackage{microtype}

% ============================================================================
% Výchozí hodnoty – Panevropská univerzita
% ============================================================================
\newcommand\University{Panevropská univerzita, a.s.}
\newcommand\Faculty{Fakulta podnikání a práva}
\newcommand\Department{}

\newcommand\ThesisType{Diplomová práce}
\newcommand\StudyProgram{Marketingové komunikace}
\newcommand\StudyBranch{Marketingové komunikace}

% Přepisy
\newcommand{\university}[1]{\renewcommand\University{#1}}
\newcommand{\faculty}[1]{\renewcommand\Faculty{#1}}
\newcommand{\department}[1]{\renewcommand\Department{#1}}
\newcommand{\thesistype}[1]{\renewcommand\ThesisType{#1}}
\newcommand{\studyprogram}[1]{\renewcommand\StudyProgram{#1}}
\newcommand{\studybranch}[1]{\renewcommand\StudyBranch{#1}}

% Vedoucí práce
\def \@supervisor{Neznámý}
\newcommand{\supervisor}[1]{\def\@supervisor{#1}}

\def \@supervisorAffiliation{Neznámý}
\newcommand{\supervisorAffiliation}[1]{\def\@supervisorAffiliation{#1}}

\def \@placeyear{Praha 2026}
\newcommand{\placeyear}[1]{\def\@placeyear{#1}}

% Pomocné příkazy
\newcommand{\figref}[1]{Obrázek~\ref{#1}}
\newcommand{\tabref}[1]{Tabulka~\ref{#1}}
\newcommand{\secref}[1]{Kapitola~\ref{#1}}

% ============================================================================
% Titulní strana
% ============================================================================
\renewcommand\maketitle{%
  \@fullthesis
  \global\let\thanks\relax
  \global\let\maketitle\relax
  \global\let\@maketitle\relax
  \global\let\@thanks\@empty
  \global\let\@author\@empty
  \global\let\@date\@empty
  \global\let\@title\@empty
  \global\let\title\relax
  \global\let\author\relax
  \global\let\date\relax
  \global\let\and\relax
}

\def\@fullthesis{%
  \frontmatter
  \thispagestyle{empty}
  \begin{center}
    {\LARGE\bfseries \University\par}
    \vspace{3mm}
    {\Large\sffamily \Faculty\par}
    \ifx\Department\empty\else
      \vspace{2mm}
      {\large\sffamily \Department\par}
    \fi

    \vspace{12mm}
    \IfFileExists{images/symbol-panevropska-univerzita-300x300.png}{%
      \includegraphics[width=45mm]{images/symbol-panevropska-univerzita-300x300.png}%
    }{}

    \vfill
    {\Large\sffamily \ThesisType\par}
    \vspace{10mm}
    {\LARGE\bfseries \@title\par}
    \vspace{16mm}

    {\large
    \begin{tabular}{@{}rl@{}}
      Autor: & \@author \\
      Studijní program: & \StudyProgram \\
      Vedoucí práce: & \@supervisor
    \end{tabular}\par}

    \vfill
    {\large \@placeyear\par}
  \end{center}
  \newpage

  % Strana 2 – vedoucí práce (minimalistická verze)
  \thispagestyle{empty}
  \rule{0pt}{0pt}
  \vfill
  \noindent Vedoucí práce: \@supervisor\\
  \@supervisorAffiliation\\[1.5ex]
  Copyright {\copyright} {\@date} {\@author}
  \newpage
}

% ============================================================================
% Bibliografie – ISO 690 (číslované odkazy)
% ============================================================================
\RequirePackage[style=numeric,sorting=none,backend=biber]{biblatex}

\DeclareBibliographyCategory{fullcited}
\newcommand{\bibentry}[1]{\fullcite{#1}\addtocategory{fullcited}{#1}}

\RequirePackage[nottoc]{tocbibind}
\RequirePackage{setspace}
\onehalfspacing % Standardní řádkování 1.5 pro závěrečné práce

% Hypertextové odkazy
\RequirePackage{xcolor}
\RequirePackage{hyperref}
\hypersetup{%
  colorlinks=true,
  citecolor=blue!60!black,
  linkcolor=black,
  urlcolor=blue!60!black,
  hypertexnames=false
}

% PDF metadata
\makeatletter
\AtBeginDocument{%
  \hypersetup{%
    pdftitle={\@title},
    pdfauthor={\@author},
    pdfsubject={\ThesisType},
  }%
}
\makeatother
