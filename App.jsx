import React, { Component, useState, useEffect, useMemo, useRef, ErrorInfo, ReactNode } from "react";
import {
  Calendar,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Lock,
  Search,
  RefreshCw,
  Clock,
  ArrowRight,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  GraduationCap,
  MessageCircle,
  UploadCloud,
  FileText,
  SlidersHorizontal,
  Info,
  Check,
  X,
  Eye,
  Trash2,
  Smartphone,
  ChevronDown,
  Edit3,
  Image as ImageIcon
} from "lucide-react";

// ==========================================
// 1. DATA TYPES & CONSTANTS
// ==========================================

export type ClassGrade = "9A" | "9B" | "9C" | "9D" | "9E";
export type AttendanceStatus = "Izin" | "Sakit" | "Hadir";
export type ApprovalStatus = "Menunggu" | "Disetujui" | "Ditolak";

export interface Student {
  id: string;
  nis: string;
  name: string;
  classGrade: ClassGrade;
  gender: "L" | "P";
}

export interface AttendanceRecord {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  studentClass: ClassGrade;
  nis: string;
  status: AttendanceStatus;
  reason: string;
  photoProof?: string; // Base64 data URL (optional if cleared by admin)
  submissionNumber: 1 | 2; // 1 = Initial, 2 = Correction
  approvalStatus: ApprovalStatus;
  adminNotes?: string;
  reviewedAt?: string;
  lastEditedByAdmin?: boolean;
}

const WHATSAPP_LINK = "https://wa.me/6287751902342";
const ADMIN_PASSWORD = "admin#123$";
const STORAGE_KEY = "presensi_siswa_records_v2_light";
const ADMIN_SESSION_KEY = "presensi_admin_authenticated";

// ==========================================
// 2. MASTER STUDENTS DATA (130 Students: 9A - 9E)
// ==========================================

export const MASTER_STUDENTS: Student[] = [
  // Kelas 9A (26 Students)
  { id: "9A-01", nis: "230901", name: "Achmad Fauzan Ramadhan", classGrade: "9A", gender: "L" },
  { id: "9A-02", nis: "230902", name: "Adelia Putri Kusuma", classGrade: "9A", gender: "P" },
  { id: "9A-03", nis: "230903", name: "Agung Pratama Putra", classGrade: "9A", gender: "L" },
  { id: "9A-04", nis: "230904", name: "Aisyah Nur Salsabila", classGrade: "9A", gender: "P" },
  { id: "9A-05", nis: "230905", name: "Alif Hidayatullah", classGrade: "9A", gender: "L" },
  { id: "9A-06", nis: "230906", name: "Anisa Rahmawati", classGrade: "9A", gender: "P" },
  { id: "9A-07", nis: "230907", name: "Arya Bima Sena", classGrade: "9A", gender: "L" },
  { id: "9A-08", nis: "230908", name: "Bagus Tri Wicaksono", classGrade: "9A", gender: "L" },
  { id: "9A-09", nis: "230909", name: "Cantika Dwi Lestari", classGrade: "9A", gender: "P" },
  { id: "9A-10", nis: "230910", name: "Daffa Ibnu Hafizh", classGrade: "9A", gender: "L" },
  { id: "9A-11", nis: "230911", name: "Dina Kartika Sari", classGrade: "9A", gender: "P" },
  { id: "9A-12", nis: "230912", name: "Fajar Kurniawan", classGrade: "9A", gender: "L" },
  { id: "9A-13", nis: "230913", name: "Fatimah Azzahra", classGrade: "9A", gender: "P" },
  { id: "9A-14", nis: "230914", name: "Galang Aditya Pratama", classGrade: "9A", gender: "L" },
  { id: "9A-15", nis: "230915", name: "Hafiz Ridho Illahi", classGrade: "9A", gender: "L" },
  { id: "9A-16", nis: "230916", name: "Indah Permata Sari", classGrade: "9A", gender: "P" },
  { id: "9A-17", nis: "230917", name: "Kevin Chandra Wijaya", classGrade: "9A", gender: "L" },
  { id: "9A-18", nis: "230918", name: "Larasati Dewi", classGrade: "9A", gender: "P" },
  { id: "9A-19", nis: "230919", name: "Muhammad Rizky Maulana", classGrade: "9A", gender: "L" },
  { id: "9A-20", nis: "230920", name: "Nabila Syifa Wardani", classGrade: "9A", gender: "P" },
  { id: "9A-21", nis: "230921", name: "Putri Anggraini", classGrade: "9A", gender: "P" },
  { id: "9A-22", nis: "230922", name: "Rafi Ahmad Firdaus", classGrade: "9A", gender: "L" },
  { id: "9A-23", nis: "230923", name: "Siti Nurhaliza", classGrade: "9A", gender: "P" },
  { id: "9A-24", nis: "230924", name: "Tio Sandi Pratama", classGrade: "9A", gender: "L" },
  { id: "9A-25", nis: "230925", name: "Vina Melinda", classGrade: "9A", gender: "P" },
  { id: "9A-26", nis: "230926", name: "Zidan Farhan Mubarak", classGrade: "9A", gender: "L" },

  // Kelas 9B (26 Students)
  { id: "9B-01", nis: "230927", name: "Aldi Wahyu Nugroho", classGrade: "9B", gender: "L" },
  { id: "9B-02", nis: "230928", name: "Amanda Chelsea", classGrade: "9B", gender: "P" },
  { id: "9B-03", nis: "230929", name: "Andi Saputra", classGrade: "9B", gender: "L" },
  { id: "9B-04", nis: "230930", name: "Annisa Maharani", classGrade: "9B", gender: "P" },
  { id: "9B-05", nis: "230931", name: "Bagus Hendrawan", classGrade: "9B", gender: "L" },
  { id: "9B-06", nis: "230932", name: "Bunga Citra Lestari", classGrade: "9B", gender: "P" },
  { id: "9B-07", nis: "230933", name: "Danang Pamungkas", classGrade: "9B", gender: "L" },
  { id: "9B-08", nis: "230934", name: "Dewi Sekar Kinanti", classGrade: "9B", gender: "P" },
  { id: "9B-09", nis: "230935", name: "Dimas Arya Pangestu", classGrade: "9B", gender: "L" },
  { id: "9B-10", nis: "230936", name: "Elisa Triana", classGrade: "9B", gender: "P" },
  { id: "9B-11", nis: "230937", name: "Fathir Maulana", classGrade: "9B", gender: "L" },
  { id: "9B-12", nis: "230938", name: "Giska Amelia", classGrade: "9B", gender: "P" },
  { id: "9B-13", nis: "230939", name: "Hendra Wijaya", classGrade: "9B", gender: "L" },
  { id: "9B-14", nis: "230940", name: "Ika Nurjanah", classGrade: "9B", gender: "P" },
  { id: "9B-15", nis: "230941", name: "Irfan Hakim", classGrade: "9B", gender: "L" },
  { id: "9B-16", nis: "230942", name: "Jihan Farhana", classGrade: "9B", gender: "P" },
  { id: "9B-17", nis: "230943", name: "Kenzo Alvaro", classGrade: "9B", gender: "L" },
  { id: "9B-18", nis: "230944", name: "Maulida Nurul Aini", classGrade: "9B", gender: "P" },
  { id: "9B-19", nis: "230945", name: "Naufal Ihsan Rabbani", classGrade: "9B", gender: "L" },
  { id: "9B-20", nis: "230946", name: "Putra Sanjaya", classGrade: "9B", gender: "L" },
  { id: "9B-21", nis: "230947", name: "Rania Bilqis", classGrade: "9B", gender: "P" },
  { id: "9B-22", nis: "230948", name: "Rehan Bagaskara", classGrade: "9B", gender: "L" },
  { id: "9B-23", nis: "230949", name: "Salwa Khairunnisa", classGrade: "9B", gender: "P" },
  { id: "9B-24", nis: "230950", name: "Satria Dharma", classGrade: "9B", gender: "L" },
  { id: "9B-25", nis: "230951", name: "Tiara Andini", classGrade: "9B", gender: "P" },
  { id: "9B-26", nis: "230952", name: "Yusuf Habibie", classGrade: "9B", gender: "L" },

  // Kelas 9C (26 Students)
  { id: "9C-01", nis: "230953", name: "Adnan Malik Ibrahim", classGrade: "9C", gender: "L" },
  { id: "9C-02", nis: "230954", name: "Almira Zahra", classGrade: "9C", gender: "P" },
  { id: "9C-03", nis: "230955", name: "Bayu Aji Pamungkas", classGrade: "9C", gender: "L" },
  { id: "9C-04", nis: "230956", name: "Bella Safira", classGrade: "9C", gender: "P" },
  { id: "9C-05", nis: "230957", name: "Bima Arya Kusuma", classGrade: "9C", gender: "L" },
  { id: "9C-06", nis: "230958", name: "Chelse Olivia", classGrade: "9C", gender: "P" },
  { id: "9C-07", nis: "230959", name: "Denis Pratama", classGrade: "9C", gender: "L" },
  { id: "9C-08", nis: "230960", name: "Dwi Ayu Novitasari", classGrade: "9C", gender: "P" },
  { id: "9C-09", nis: "230961", name: "Eko Prasetyo", classGrade: "9C", gender: "L" },
  { id: "9C-10", nis: "230962", name: "Farah Diba", classGrade: "9C", gender: "P" },
  { id: "9C-11", nis: "230963", name: "Ghani Alamsyah", classGrade: "9C", gender: "L" },
  { id: "9C-12", nis: "230964", name: "Hanifah Zahirah", classGrade: "9C", gender: "P" },
  { id: "9C-13", nis: "230965", name: "Ilham Ramadhan", classGrade: "9C", gender: "L" },
  { id: "9C-14", nis: "230966", name: "Intan Permadani", classGrade: "9C", gender: "P" },
  { id: "9C-15", nis: "230967", name: "Joko Susilo", classGrade: "9C", gender: "L" },
  { id: "9C-16", nis: "230968", name: "Kirana Putri", classGrade: "9C", gender: "P" },
  { id: "9C-17", nis: "230969", name: "Lukman Hakim", classGrade: "9C", gender: "L" },
  { id: "9C-18", nis: "230970", name: "Melati Kusuma", classGrade: "9C", gender: "P" },
  { id: "9C-19", nis: "230971", name: "Naufal Hilmi", classGrade: "9C", gender: "L" },
  { id: "9C-20", nis: "230972", name: "Nurul Hidayah", classGrade: "9C", gender: "P" },
  { id: "9C-21", nis: "230973", name: "Panji Gumilang", classGrade: "9C", gender: "L" },
  { id: "9C-22", nis: "230974", name: "Ratna Sari", classGrade: "9C", gender: "P" },
  { id: "9C-23", nis: "230975", name: "Rizky Ramadhan", classGrade: "9C", gender: "L" },
  { id: "9C-24", nis: "230976", name: "Salsabila Firdaus", classGrade: "9C", gender: "P" },
  { id: "9C-25", nis: "230977", name: "Teguh Santoso", classGrade: "9C", gender: "L" },
  { id: "9C-26", nis: "230978", name: "Wulan Dari", classGrade: "9C", gender: "P" },

  // Kelas 9D (26 Students)
  { id: "9D-01", nis: "230979", name: "Abdurrahman Wahid", classGrade: "9D", gender: "L" },
  { id: "9D-02", nis: "230980", name: "Anindya Keisha", classGrade: "9D", gender: "P" },
  { id: "9D-03", nis: "230981", name: "Bagus Setiawan", classGrade: "9D", gender: "L" },
  { id: "9D-04", nis: "230982", name: "Chika Jessica", classGrade: "9D", gender: "P" },
  { id: "9D-05", nis: "230983", name: "Danu Tirta", classGrade: "9D", gender: "L" },
  { id: "9D-06", nis: "230984", name: "Dian Pelangi", classGrade: "9D", gender: "P" },
  { id: "9D-07", nis: "230985", name: "Erlangga Putra", classGrade: "9D", gender: "L" },
  { id: "9D-08", nis: "230986", name: "Febriana Santoso", classGrade: "9D", gender: "P" },
  { id: "9D-09", nis: "230987", name: "Gilang Dirga", classGrade: "9D", gender: "L" },
  { id: "9D-10", nis: "230988", name: "Hilda Amalia", classGrade: "9D", gender: "P" },
  { id: "9D-11", nis: "230989", name: "Indra Lesmana", classGrade: "9D", gender: "L" },
  { id: "9D-12", nis: "230990", name: "Jasmine Azzahra", classGrade: "9D", gender: "P" },
  { id: "9D-13", nis: "230991", name: "Kurnia Sandi", classGrade: "9D", gender: "L" },
  { id: "9D-14", nis: "230992", name: "Lia Agustina", classGrade: "9D", gender: "P" },
  { id: "9D-15", nis: "230993", name: "Mario Teguh Pratama", classGrade: "9D", gender: "L" },
  { id: "9D-16", nis: "230994", name: "Nadya Arina", classGrade: "9D", gender: "P" },
  { id: "9D-17", nis: "230995", name: "Oki Setiawan", classGrade: "9D", gender: "L" },
  { id: "9D-18", nis: "230996", name: "Prilly Latuconsina", classGrade: "9D", gender: "P" },
  { id: "9D-19", nis: "230997", name: "Qori Al-Ghifari", classGrade: "9D", gender: "L" },
  { id: "9D-20", nis: "230998", name: "Ririn Dwi Ariyanti", classGrade: "9D", gender: "P" },
  { id: "9D-21", nis: "230999", name: "Septian Dwi Nugraha", classGrade: "9D", gender: "L" },
  { id: "9D-22", nis: "231000", name: "Tania Putri", classGrade: "9D", gender: "P" },
  { id: "9D-23", nis: "231001", name: "Umar Bakri", classGrade: "9D", gender: "L" },
  { id: "9D-24", nis: "231002", name: "Vicky Prasetyo", classGrade: "9D", gender: "L" },
  { id: "9D-25", nis: "231003", name: "Widya Astuti", classGrade: "9D", gender: "P" },
  { id: "9D-26", nis: "231004", name: "Zaskia Gotik Kusuma", classGrade: "9D", gender: "P" },

  // Kelas 9E (26 Students)
  { id: "9E-01", nis: "231005", name: "Agil Saputra", classGrade: "9E", gender: "L" },
  { id: "9E-02", nis: "231006", name: "Bella Shofie", classGrade: "9E", gender: "P" },
  { id: "9E-03", nis: "231007", name: "Cakra Khania", classGrade: "9E", gender: "L" },
  { id: "9E-04", nis: "231008", name: "Desi Ratnasari", classGrade: "9E", gender: "P" },
  { id: "9E-05", nis: "231009", name: "Egi John Foreisythe", classGrade: "9E", gender: "L" },
  { id: "9E-06", nis: "231010", name: "Fitri Carlina", classGrade: "9E", gender: "P" },
  { id: "9E-07", nis: "231011", name: "Gading Marten", classGrade: "9E", gender: "L" },
  { id: "9E-08", nis: "231012", name: "Hesti Purwadinata", classGrade: "9E", gender: "P" },
  { id: "9E-09", nis: "231013", name: "Irfan Bachdim", classGrade: "9E", gender: "L" },
  { id: "9E-10", nis: "231014", name: "Jessica Iskandar", classGrade: "9E", gender: "P" },
  { id: "9E-11", nis: "231015", name: "Kaesang Pangarep", classGrade: "9E", gender: "L" },
  { id: "9E-12", nis: "231016", name: "Luna Maya Lestari", classGrade: "9E", gender: "P" },
  { id: "9E-13", nis: "231017", name: "Marcell Siahaan", classGrade: "9E", gender: "L" },
  { id: "9E-14", nis: "231018", name: "Nikita Mirzani", classGrade: "9E", gender: "P" },
  { id: "9E-15", nis: "231019", name: "Olla Ramlan", classGrade: "9E", gender: "P" },
  { id: "9E-16", nis: "231020", name: "Pasha Ungu Putra", classGrade: "9E", gender: "L" },
  { id: "9E-17", nis: "231021", name: "Raisa Andriana", classGrade: "9E", gender: "P" },
  { id: "9E-18", nis: "231022", name: "Raffi Ahmad Dani", classGrade: "9E", gender: "L" },
  { id: "9E-19", nis: "231023", name: "Syahrini Fatimah", classGrade: "9E", gender: "P" },
  { id: "9E-20", nis: "231024", name: "Taufik Hidayat", classGrade: "9E", gender: "L" },
  { id: "9E-21", nis: "231025", name: "Ussy Sulistiawaty", classGrade: "9E", gender: "P" },
  { id: "9E-22", nis: "231026", name: "Vidi Aldiano", classGrade: "9E", gender: "L" },
  { id: "9E-23", nis: "231027", name: "Wika Salim", classGrade: "9E", gender: "P" },
  { id: "9E-24", nis: "231028", name: "Yovie Widianto", classGrade: "9E", gender: "L" },
  { id: "9E-25", nis: "231029", name: "Zaskia Adya Mecca", classGrade: "9E", gender: "P" },
  { id: "9E-26", nis: "231030", name: "Zainal Abidin Domba", classGrade: "9E", gender: "L" }
];

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getInitialSeedRecords = (): AttendanceRecord[] => {
  const today = getTodayDateString();
  return [
    {
      id: "REC-SEED-01",
      timestamp: `${today}T06:45:10.000Z`,
      date: today,
      studentId: "9A-04",
      nis: "230904",
      studentName: "Aisyah Nur Salsabila",
      studentClass: "9A",
      status: "Sakit",
      reason: "Demam tinggi sejak semalam, istirahat dokter 2 hari",
      photoProof: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23f1f5f9'/><text x='50%25' y='45%25' font-family='sans-serif' font-size='15' font-weight='bold' fill='%230f766e' text-anchor='middle'>SURAT KETERANGAN DOKTER</text><text x='50%25' y='58%25' font-family='sans-serif' font-size='12' fill='%23475569' text-anchor='middle'>Klinik Sehat Medika - Aisyah Nur (9A)</text></svg>",
      submissionNumber: 1,
      approvalStatus: "Disetujui",
      adminNotes: "Surat dokter valid, istirahat 2 hari.",
      reviewedAt: `${today}T07:15:00.000Z`
    },
    {
      id: "REC-SEED-02",
      timestamp: `${today}T07:05:22.000Z`,
      date: today,
      studentId: "9B-01",
      nis: "230927",
      studentName: "Aldi Wahyu Nugroho",
      studentClass: "9B",
      status: "Izin",
      reason: "Mengikuti turnamen catur tingkat provinsi mewakili sekolah",
      photoProof: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23f8fafc'/><text x='50%25' y='45%25' font-family='sans-serif' font-size='15' font-weight='bold' fill='%234338ca' text-anchor='middle'>SURAT DISPENSASI LOMBA</text><text x='50%25' y='58%25' font-family='sans-serif' font-size='12' fill='%2364748b' text-anchor='middle'>Pengcab Percasi - Aldi Wahyu (9B)</text></svg>",
      submissionNumber: 1,
      approvalStatus: "Menunggu"
    },
    {
      id: "REC-SEED-03",
      timestamp: `${today}T07:18:40.000Z`,
      date: today,
      studentId: "9C-10",
      nis: "230962",
      studentName: "Farah Diba",
      studentClass: "9C",
      status: "Izin",
      reason: "Acara keluarga pemakaman kakek kandung di luar kota",
      photoProof: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23f1f5f9'/><text x='50%25' y='45%25' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23059669' text-anchor='middle'>SURAT IZIN ORANG TUA</text><text x='50%25' y='58%25' font-family='sans-serif' font-size='12' fill='%23475569' text-anchor='middle'>Farah Diba - Kelas 9C</text></svg>",
      submissionNumber: 1,
      approvalStatus: "Disetujui",
      adminNotes: "Disetujui oleh wali kelas."
    },
    {
      id: "REC-SEED-04",
      timestamp: `${today}T07:30:15.000Z`,
      date: today,
      studentId: "9D-05",
      nis: "230983",
      studentName: "Danu Tirta",
      studentClass: "9D",
      status: "Sakit",
      reason: "Terkilir pergelangan kaki saat latihan futsal",
      photoProof: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'><rect width='400' height='260' fill='%23f8fafc'/><text x='50%25' y='45%25' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23e11d48' text-anchor='middle'>FOTO SURAT KETERANGAN KLINIK</text><text x='50%25' y='58%25' font-family='sans-serif' font-size='12' fill='%2364748b' text-anchor='middle'>RSUD Kota - Danu Tirta (9D)</text></svg>",
      submissionNumber: 1,
      approvalStatus: "Menunggu"
    }
  ];
};

// ==========================================
// 3. ERROR BOUNDARY
// ==========================================

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Terjadi Gangguan Sistem</h2>
            <p className="text-sm text-slate-600">
              Aplikasi mendeteksi kendala pada tampilan. Data Anda tetap tersimpan aman di peramban ini.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm transition flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
              </button>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-medium border border-emerald-200 transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" /> Hubungi WhatsApp Support
              <
