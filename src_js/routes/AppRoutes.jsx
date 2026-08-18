import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryPage from "../pages/CategoryPage";
import StockDetails from "../pages/StockDetails";
import Watchlist from "../pages/Watchlist";
import WeeklyWealth from "../pages/WeeklyWealth";
import WorldEconomy from "../pages/WorldEconomy";
import SectorUpdate from "../pages/SectorUpdate";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/category/:type" element={<CategoryPage />} />
      <Route path="/stocks/:symbol" element={<StockDetails />} />
      <Route path="/watchlist" element={<Watchlist />} />
      <Route path="/weekly-wealth" element={<WeeklyWealth />} />
      <Route path="/world-economy" element={<WorldEconomy />} />
      <Route path="/sector-update" element={<SectorUpdate />} />

      {/* Route Fallbacks */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
