--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.17 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: book_inventory; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.book_inventory (
    id integer NOT NULL,
    book_id integer,
    rack_id integer,
    stock integer DEFAULT 0
);


ALTER TABLE public.book_inventory OWNER TO rafi;

--
-- Name: book_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: rafi
--

CREATE SEQUENCE public.book_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.book_inventory_id_seq OWNER TO rafi;

--
-- Name: book_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rafi
--

ALTER SEQUENCE public.book_inventory_id_seq OWNED BY public.book_inventory.id;


--
-- Name: books; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.books (
    id integer NOT NULL,
    title character varying(255),
    author character varying(255),
    publisher character varying(255),
    year integer,
    isbn character varying(50)
);


ALTER TABLE public.books OWNER TO rafi;

--
-- Name: books_id_seq; Type: SEQUENCE; Schema: public; Owner: rafi
--

CREATE SEQUENCE public.books_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.books_id_seq OWNER TO rafi;

--
-- Name: books_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rafi
--

ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;


--
-- Name: inventory; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.inventory (
    id integer NOT NULL,
    book_id integer,
    location character varying(255),
    stock integer
);


ALTER TABLE public.inventory OWNER TO rafi;

--
-- Name: inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: rafi
--

CREATE SEQUENCE public.inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.inventory_id_seq OWNER TO rafi;

--
-- Name: inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rafi
--

ALTER SEQUENCE public.inventory_id_seq OWNED BY public.inventory.id;


--
-- Name: students; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.students (
    id integer NOT NULL,
    nim character varying(20),
    name character varying(255),
    active boolean DEFAULT true
);


ALTER TABLE public.students OWNER TO rafi;

--
-- Name: students_id_seq; Type: SEQUENCE; Schema: public; Owner: rafi
--

CREATE SEQUENCE public.students_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.students_id_seq OWNER TO rafi;

--
-- Name: students_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rafi
--

ALTER SEQUENCE public.students_id_seq OWNED BY public.students.id;


--
-- Name: transaction_books; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.transaction_books (
    transaction_id integer NOT NULL,
    book_id integer NOT NULL,
    status character varying(50) DEFAULT 'borrowed'::character varying,
    inventory_id integer
);


ALTER TABLE public.transaction_books OWNER TO rafi;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: rafi
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    student_id integer,
    loan_date date DEFAULT CURRENT_DATE,
    return_date date,
    status character varying(50) DEFAULT 'pending'::character varying,
    return_date_at timestamp without time zone
);


ALTER TABLE public.transactions OWNER TO rafi;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: rafi
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transactions_id_seq OWNER TO rafi;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rafi
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: book_inventory id; Type: DEFAULT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.book_inventory ALTER COLUMN id SET DEFAULT nextval('public.book_inventory_id_seq'::regclass);


--
-- Name: books id; Type: DEFAULT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.books ALTER COLUMN id SET DEFAULT nextval('public.books_id_seq'::regclass);


--
-- Name: inventory id; Type: DEFAULT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.inventory ALTER COLUMN id SET DEFAULT nextval('public.inventory_id_seq'::regclass);


--
-- Name: students id; Type: DEFAULT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.students ALTER COLUMN id SET DEFAULT nextval('public.students_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Data for Name: book_inventory; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.book_inventory (id, book_id, rack_id, stock) FROM stdin;
\.


--
-- Data for Name: books; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.books (id, title, author, publisher, year, isbn) FROM stdin;
8	Javascript For World	Robert C. Martinn	Prentice Hall	2014	9780132354
11	Cahaya dunia	Firman	Gramedia	2011	11299191
\.


--
-- Data for Name: inventory; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.inventory (id, book_id, location, stock) FROM stdin;
1	\N	lab	20
2	\N	ada	29
3	\N	a	1
6	8	lab	12
8	11	Perpustakaan cikini	0
7	8	Gudang	7
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.students (id, nim, name, active) FROM stdin;
5	201919	Endah	t
\.


--
-- Data for Name: transaction_books; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.transaction_books (transaction_id, book_id, status, inventory_id) FROM stdin;
1	11	borrowed	8
2	8	borrowed	7
3	11	borrowed	8
4	8	borrowed	6
5	8	borrowed	6
6	11	borrowed	8
6	8	borrowed	6
7	11	borrowed	8
8	11	borrowed	8
27	8	borrowed	7
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: rafi
--

COPY public.transactions (id, student_id, loan_date, return_date, status, return_date_at) FROM stdin;
5	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:07:15.233716
4	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:07:21.310542
3	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:07:24.874158
2	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:07:27.308845
1	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:07:29.991173
6	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:16:37.298007
7	5	2025-04-16	2025-04-30	dikembalikan	2025-04-16 01:20:16.365461
8	5	2025-04-16	2025-04-30	dipinjam	\N
9	5	2025-04-16	2025-04-30	dipinjam	\N
10	5	2025-04-16	2025-04-30	dipinjam	\N
11	5	2025-04-16	2025-04-30	dipinjam	\N
12	5	2025-04-16	2025-04-30	dipinjam	\N
13	5	2025-04-16	2025-04-30	dipinjam	\N
14	5	2025-04-16	2025-04-30	dipinjam	\N
15	5	2025-04-16	2025-04-30	dipinjam	\N
16	5	2025-04-16	2025-04-30	dipinjam	\N
17	5	2025-04-16	2025-04-30	dipinjam	\N
18	5	2025-04-16	2025-04-30	dipinjam	\N
19	5	2025-04-16	2025-04-30	dipinjam	\N
20	5	2025-04-16	2025-04-30	dipinjam	\N
21	5	2025-04-16	2025-04-30	dipinjam	\N
27	5	2025-04-16	2025-04-18	dipinjam	\N
\.


--
-- Name: book_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rafi
--

SELECT pg_catalog.setval('public.book_inventory_id_seq', 1, false);


--
-- Name: books_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rafi
--

SELECT pg_catalog.setval('public.books_id_seq', 11, true);


--
-- Name: inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rafi
--

SELECT pg_catalog.setval('public.inventory_id_seq', 8, true);


--
-- Name: students_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rafi
--

SELECT pg_catalog.setval('public.students_id_seq', 5, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rafi
--

SELECT pg_catalog.setval('public.transactions_id_seq', 27, true);


--
-- Name: book_inventory book_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.book_inventory
    ADD CONSTRAINT book_inventory_pkey PRIMARY KEY (id);


--
-- Name: books books_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.books
    ADD CONSTRAINT books_pkey PRIMARY KEY (id);


--
-- Name: inventory inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_pkey PRIMARY KEY (id);


--
-- Name: students students_nim_key; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_nim_key UNIQUE (nim);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: transaction_books transaction_books_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transaction_books
    ADD CONSTRAINT transaction_books_pkey PRIMARY KEY (transaction_id, book_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: book_inventory book_inventory_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.book_inventory
    ADD CONSTRAINT book_inventory_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: inventory inventory_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.inventory
    ADD CONSTRAINT inventory_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: transaction_books transaction_books_book_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transaction_books
    ADD CONSTRAINT transaction_books_book_id_fkey FOREIGN KEY (book_id) REFERENCES public.books(id);


--
-- Name: transaction_books transaction_books_inventory_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transaction_books
    ADD CONSTRAINT transaction_books_inventory_id_fkey FOREIGN KEY (inventory_id) REFERENCES public.inventory(id) ON DELETE SET NULL;


--
-- Name: transaction_books transaction_books_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transaction_books
    ADD CONSTRAINT transaction_books_transaction_id_fkey FOREIGN KEY (transaction_id) REFERENCES public.transactions(id);


--
-- Name: transactions transactions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rafi
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- PostgreSQL database dump complete
--

