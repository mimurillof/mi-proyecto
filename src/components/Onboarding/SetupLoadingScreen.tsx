import React, { useEffect, useState } from "react";
import { Card, Progress } from "@heroui/react";
import {
  Sparkles,
  BarChart3,
  PieChart,
  CheckCircle2,
  Loader2,
} from "lucide-react";

interface SetupLoadingScreenProps {
  steps?: string[];
}

const SetupLoadingScreen: React.FC<SetupLoadingScreenProps> = ({
  steps = [
    "Analizando tendencias de mercado...",
    "Construyendo estructura de portafolio...",
    "Generando reportes iniciales...",
    "Finalizando configuración...",
  ],
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simular progreso para UX
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Incremento variable para parecer más "real"
        const increment = Math.random() * 2;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Cambiar pasos basado en el progreso
    const stepDuration = 100 / steps.length;
    const newStep = Math.min(
      Math.floor(progress / stepDuration),
      steps.length - 1
    );
    if (newStep !== currentStep) {
      setCurrentStep(newStep);
    }
  }, [progress, steps.length, currentStep]);

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Preparando tu experiencia
          </h1>
          <p className="text-gray-500">
            Estamos configurando tu entorno financiero personalizado con IA.
          </p>
        </div>

        <Card className="p-6 bg-white shadow-xl border border-gray-100">
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span>Progreso</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress
                value={progress}
                color="primary"
                className="h-2"
                aria-label="Progreso de configuración"
              />
            </div>

            {/* Steps List */}
            <div className="space-y-4">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 transition-all duration-300 ${
                      isCurrent ? "scale-105 transform" : "opacity-70"
                    }`}
                  >
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors
                      ${
                        isCompleted
                          ? "bg-green-50 border-green-500 text-green-600"
                          : isCurrent
                          ? "bg-blue-50 border-blue-500 text-blue-600"
                          : "bg-gray-50 border-gray-200 text-gray-300"
                      }
                    `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isCompleted
                          ? "text-gray-500 line-through"
                          : isCurrent
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-400">
          <div className="flex flex-col items-center gap-1">
            <BarChart3 className="w-4 h-4" />
            <span>Análisis de Mercado</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <PieChart className="w-4 h-4" />
            <span>Optimización de Cartera</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Sparkles className="w-4 h-4" />
            <span>Insights de IA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupLoadingScreen;
