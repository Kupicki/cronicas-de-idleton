<?php

namespace App\Services;

use Carbon\Carbon;

class OfflineService
{
    /**
     * Calcula e aplica o progresso offline baseado no tempo desde a última vez online.
     * Retorna um relatório amigável do que ocorreu.
     * 
     * @param array &$gameState O estado atual do jogo JSON, passado por referência.
     * @param \Carbon\Carbon $lastOnline
     * @return array
     */
    public static function calculate(array &$gameState, $lastOnline)
    {
        $now = now();
        $secondsOffline = $now->diffInSeconds($lastOnline);

        // Se o tempo offline for menor que um limite mínimo (ex: 60 segundos), ignoramos
        if ($secondsOffline < 60) {
            return null;
        }

        $report = [
            'time_offline' => $secondsOffline,
            'gold_earned' => 0,
            'wood_earned' => 0,
            'essence_earned' => 0,
        ];

        // Progresso do Domínio (Edifícios)
        $buildings = $gameState['buildings'] ?? [];
        
        // Exemplo simplificado baseado no GDD:
        if (isset($buildings['woodcutter']['qty']) && $buildings['woodcutter']['qty'] > 0) {
             $report['gold_earned'] += ($buildings['woodcutter']['qty'] * 0.5) * $secondsOffline;
        }
        
        if (isset($buildings['sawmill']['qty']) && $buildings['sawmill']['qty'] > 0) {
             $report['wood_earned'] += ($buildings['sawmill']['qty'] * 5) * $secondsOffline;
        }

        if (isset($buildings['mine']['qty']) && $buildings['mine']['qty'] > 0) {
            $report['gold_earned'] += ($buildings['mine']['qty'] * 5) * $secondsOffline;
        }

        // Aplica ao state global
        if (!isset($gameState['resources'])) {
             $gameState['resources'] = ['gold' => 0, 'wood' => 0, 'essence' => 0, 'scrap' => 0, 'iron' => 0];
        }

        $gameState['resources']['gold'] += floor($report['gold_earned']);
        $gameState['resources']['wood'] += floor($report['wood_earned']);
        $gameState['resources']['essence'] += floor($report['essence_earned']);

        return $report;
    }
}
