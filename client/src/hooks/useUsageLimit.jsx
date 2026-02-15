import { useState, useEffect, useCallback } from 'react';
import * as usageService from '../services/usageService';

// hook customizado pra gerenciar todo o esquema de limite diário
// não precisa mais de userId — o backend identifica pelo token
export function useUsageLimit() {
  const [usageData, setUsageData] = useState({
    canUse: true,
    dailyUsage: 0,
    dailyLimit: 5,
    remaining: 5,
    loading: true,
    error: null
  });

  // aqui carregamos os dados de uso do usuário
  const loadUsageData = useCallback(async () => {
    try {
      setUsageData(prev => ({ ...prev, loading: true, error: null }));
      
      const data = await usageService.checkUsageLimit();
      
      setUsageData({
        canUse: data.canUse,
        dailyUsage: data.dailyUsage,
        dailyLimit: data.dailyLimit,
        remaining: data.remaining,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Erro ao carregar dados de uso:', error);
      setUsageData(prev => ({
        ...prev,
        loading: false,
        error: 'Erro ao verificar limite de uso'
      }));
    }
  }, []);

  // carrega os dados quando o componente monta
  useEffect(() => {
    loadUsageData();
  }, [loadUsageData]);

  // aqui atualiza os dados de uso após uma análise
  const updateUsageAfterAnalysis = useCallback((newUsageData) => {
    if (newUsageData) {
      setUsageData(prev => ({
        ...prev,
        dailyUsage: newUsageData.dailyUsage,
        dailyLimit: newUsageData.dailyLimit,
        remaining: newUsageData.remaining,
        canUse: newUsageData.remaining > 0
      }));
    }
  }, []);

  // aqui recarrega os dados manualmente (útil pra quando resetar)
  const refresh = useCallback(() => {
    loadUsageData();
  }, [loadUsageData]);

  return {
    ...usageData,
    updateUsageAfterAnalysis,
    refresh
  };
}