import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  Calendar,
  DollarSign,
  Users,
  Package,
  Wrench,
  Plus,
} from "lucide-react";
import { MainLayout } from "../../../shared/layout/MainLayout";
import { DashboardCard } from "../components/DashboardCard";
import { getDashboardStats } from "../services/dashboardService";
import type { DashboardStats } from "../services/dashboardService";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    // Load stats
    getDashboardStats().then(setStats);
  }, []);

  const menuItems = [
    {
      title: "Pedidos",
      icon: ClipboardList,
      color: "#9C89FF",
      route: "/pedidos",
    },
    { title: "Agenda", icon: Calendar, color: "#57D9A3", route: "/agenda" },
    {
      title: "Financeiro",
      icon: DollarSign,
      color: "#79E2F2",
      route: "/financeiro",
    },
    { title: "Clientes", icon: Users, color: "#FFC542", route: "/clientes" },
    {
      title: "Peças & Estoque",
      icon: Package,
      color: "#7DA0FA",
      route: "/estoque",
    },
    { title: "Serviços", icon: Wrench, color: "#7DA0FA", route: "/servicos" },
  ];

  return (
    <MainLayout>
      {/* Banner Promocional */}
      <div
        style={{
          background: "linear-gradient(90deg, #4C3BCA 0%, #6F61E8 100%)",
          borderRadius: "16px",
          padding: "1.5rem",
          color: "white",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 4px 12px rgba(76, 59, 202, 0.3)",
        }}
      >
        <div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              ATUALIZAÇÃO NA ÁREA
            </span>
            <span
              style={{
                background: "white",
                color: "#4C3BCA",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: "bold",
              }}
            >
              PRO
            </span>
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "4px" }}>
            Mais controle na sua oficina!
          </h2>
          <p style={{ opacity: 0.9, fontSize: "0.9rem" }}>
            Gerencie ordens de serviço e clientes em um só lugar.
          </p>
        </div>
      </div>

      {/* Grid de Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {menuItems.map((item) => (
          <DashboardCard
            key={item.title}
            title={item.title}
            icon={item.icon}
            color={item.color}
            onClick={() => navigate(item.route)}
          />
        ))}
      </div>

      {/* Atalhos Rápidos (Stats) */}
      <h3
        style={{
          fontSize: "0.9rem",
          color: "var(--text-secondary)",
          marginBottom: "1rem",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        Resumo Rápido
      </h3>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          overflowX: "auto",
          paddingBottom: "1rem",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "12px",
            minWidth: "140px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              display: "block",
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
            }}
          >
            Ordens Abertas
          </span>
          <strong style={{ fontSize: "1.5rem", color: "var(--primary)" }}>
            {stats?.totalOrdens || 0}
          </strong>
        </div>
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "12px",
            minWidth: "140px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              display: "block",
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
            }}
          >
            Clientes
          </span>
          <strong style={{ fontSize: "1.5rem", color: "var(--success)" }}>
            {stats?.totalClientes || 0}
          </strong>
        </div>
        <div
          style={{
            background: "white",
            padding: "1rem",
            borderRadius: "12px",
            minWidth: "140px",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span
            style={{
              display: "block",
              color: "var(--text-secondary)",
              fontSize: "0.8rem",
            }}
          >
            Faturamento
          </span>
          <strong style={{ fontSize: "1.2rem", color: "var(--warning)" }}>
            R$ {stats?.faturamentoTotal.toFixed(2) || "0.00"}
          </strong>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate("/pedidos?new=true")}
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "50%",
          transform: "translateX(50%)",
          backgroundColor: "#2D2D53",
          color: "white",
          padding: "1rem 2rem",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 200,
          width: "90%",
          maxWidth: "400px",
          justifyContent: "center",
        }}
      >
        <Plus size={20} />
        <span style={{ fontWeight: 600 }}>Criar novo pedido</span>
      </button>
    </MainLayout>
  );
};
