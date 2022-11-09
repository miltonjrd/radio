<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function authenticate() 
    {
        $user = auth()->user();
        $notifications = Notification::where('user_id', $user->id)->get();
        
        $user['notifications'] = $notifications;
        return response()->json($user);
    }

    public function login(Request $req) 
    {
        $req->validate([
            'identifier' => 'required|string',
            'password' => 'required|string'
        ]);

        // try with username
        $token = auth()->attempt(['name' => $req->identifier, 'password' => $req->password]);

        if (!$token)
            // try with email
            $token = auth()->attempt(['email' => $req->identifier, 'password' => $req->password]);

            if (!$token)
                return response()->json([
                    'status' => 'error',
                    'message' => 'Credenciais inválidas.'
                ], 401);

        $user = auth()->user();
        $notifications = Notification::where('user_id', $user->id)->get();
        $user['notifications'] = $notifications;
        return response()->json([
            'status' => 'success',
            'message' => 'Logado com sucesso!',
            'token' => "bearer $token",
            'user' => $user
        ]);
    }

    public function logout(Request $req) {
        auth()->logout();
        return response([]);
    }
}
