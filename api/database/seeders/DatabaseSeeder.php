<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Foundation\Auth\User;
use App\Models\Notification;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        Notification::create([
            'title' => 'Boas vindas!',
            'content' => 'Seja bem-vindo ao nosso site! Uma mensagem de verificação foi enviada para o seu email, dê uma olhada para desfrutar o melhor da nossa plataforma!',
            'read' => false,
            'user' => 1
        ]);
    }
}
