<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function listAll() {
        $users = User::all();
        return response()->json($users);
    }

    public function save(Request $req) {
        $req->validate([
            'name' => 'required|string|unique:App\Models\User',
            'email' => 'required|email|unique:App\Models\User',
            'password' => 'required|string',
            'confirm_password' => 'required|same:password'
        ], [
            'required' => 'O campo :attribute é obrigatório.',
            'same' => 'O campo :attribute deve ser igual ao campo :other'
        ]);

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => bcrypt($req->password)
        ]);

        Notification::create([
            'title' => 'Boas vindas!',
            'content' => 'Seja bem-vindo ao nosso site! Uma mensagem de verificação foi enviada para o seu email, dê uma olhada para desfrutar o melhor da nossa plataforma!',
            'read' => false,
            'user_id' => $user->id
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sua conta foi cadastrada com sucesso.'
        ]);
    }

    public function notifications(Request $req) {
        $name = $req->name;

        $user = User::where(DB::raw('binary name'), $name)
        ->first();

        $notifications = Notification::where('id', $user->id)->get();

        return response()->json($notifications);
    }

    public function readNotifications(Request $req) {
        if (!$user = auth()->user()) 
            return response()->json([
                'status' => 'error',
                'message' => 'Não autorizado.'
            ], 403);
        
        Notification::where('user_id', $user->id)
        ->where('id', '<=', $req->offset)
        ->update([
            'read' => true
        ]);
    }
}
