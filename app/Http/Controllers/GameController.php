<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\GameSave;
use App\Services\OfflineService;

class GameController extends Controller
{
    /**
     * Renderiza a view principal do jogo.
     */
    public function index()
    {
        return view('game');
    }

    /**
     * Carrega o progresso do jogador do banco.
     */
    public function load(Request $request)
    {
        // Como o foco inicial é singleplayer local, usaremos um herói padrão ou deixaremos criar.
        // Simulando que buscamos pelo nome "Zé Ninguém" ou o único save que tivermos:
        $heroName = $request->query('hero_name', 'Zé Ninguém');

        $save = GameSave::where('hero_name', $heroName)->first();

        if (!$save) {
            return response()->json(['success' => false, 'message' => 'Save não encontrado', 'data' => null]);
        }

        // Recupera os dados persistidos
        $gameState = $save->save_data;

        // Se houver lógica de offline progress e last_online_at
        if ($save->last_online_at) {
            $offlineProgress = OfflineService::calculate($gameState, $save->last_online_at);
            // $gameState será modificado pelo OfflineService caso passe por referência
            return response()->json([
                'success' => true,
                'data' => $gameState,
                'offlineReport' => $offlineProgress
            ]);
        }

        return response()->json(['success' => true, 'data' => $gameState]);
    }

    /**
     * Salva o estado atual do jogo.
     */
    public function save(Request $request)
    {
        $data = $request->validate([
            'hero_name' => 'required|string',
            'game_state' => 'required|array',
        ]);

        $save = GameSave::updateOrCreate(
            ['hero_name' => $data['hero_name']],
            [
                'save_data' => $data['game_state'],
                'last_online_at' => now(),
            ]
        );

        return response()->json(['success' => true]);
    }
}
