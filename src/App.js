import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Propiedades from "./pages/Propiedades";
import Perfil from "./pages/Perfil";
import Configuracion from "./pages/Configuracion";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AddPropiedad from "./pages/AddPropiedad";
import SearchPage from "./pages/SearchPage";
import LayoutPages from "./components/LayoutPages";
import Clientes from "./pages/Clientes";
import ProyectosPage from "./pages/ProyectosPage";
import EditPropiedad from "./pages/EditPropiedad";
import PropertyModelos from "./pages/PropertyModelos";
import PropertyMultimedia from "./pages/PropertyMultimedia";
import { AuthProvider } from "./components/AuthContext";
import AccesRoute from "./components/AccesRoute";
import PropiedadesAsesor from "./pages/PropiedadesAsesor";
import Usuarios from "./pages/Usuarios";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <LayoutPages>
                <Home />
              </LayoutPages>
            }
          />
          <Route
            path="/busqueda/:query"
            element={
              <LayoutPages>
                <SearchPage />
              </LayoutPages>
            }
          />

          <Route
            path="/propiedades"
            element={
              <ProtectedRoute>
                <Layout>
                  <AccesRoute
                    path="/propiedades"
                    roles={["admin", "asesor"]}
                    components={{
                      admin: Propiedades,
                      asesor: PropiedadesAsesor,
                    }}
                  />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/propiedades/editar/:query"
            element={
              <ProtectedRoute>
                <Layout>
                  <EditPropiedad />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:propertyId/models"
            element={
              <ProtectedRoute>
                <Layout>
                  <PropertyModelos />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/property/:propertyId/multimedia"
            element={
              <ProtectedRoute>
                <Layout>
                  <PropertyMultimedia />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/proyectos/:query"
            element={
              <LayoutPages>
                <ProyectosPage />
              </LayoutPages>
            }
          />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* <Route
          path="/propiedades"
          element={
            <AuthProvider>
            <ProtectedRoute>
            <Layout>
            <Propiedades />
            </Layout>
            </ProtectedRoute>
            </AuthProvider>
            }
            /> */}
          <Route
            path="/propiedades/nuevo"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddPropiedad />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Layout>
                  <Clientes />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <Layout>
                  <Usuarios />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <Perfil />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion"
            element={
              <ProtectedRoute>
                <Configuracion />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
