<?php

namespace App\Http\Controllers;

use App\Models\Music;
use App\Models\User;
use wapmorgan\Mp3Info\Mp3Info;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MusicController extends Controller
{
    public function listAll()
    {
        $results = Music::from('musics as m')->select([
            'm.title',
            'm.created_at',
            'm.audio_path',
            'm.thumb_path',
            'm.duration',
            DB::raw('u.name as username')
        ])->join('users as u', 'm.user_id', 'u.id')
        ->orderBy('m.id', 'desc')
        ->get();

        return response()->json($results);
    }

    public function get()
    {
        //$music = Music::first();
        $audio = new Mp3Info('3QrIxjl7xbUYekAL4gSYj4SuU1Gv9HpmYzevHAfy.mp3');
        return response($audio->duration);
    }

    public function perUser(Request $req)
    {
        $user = User::where('name', $req->username)->first();

        if (!$user)
            return response()->json([
                'status' => 'error',
                'message' => 'Usuario inexistente.'
            ]);

        $musics = Music::where('user_id', $user->id)->get();
        
        return response()->json($musics);
    }

    public function save(Request $req)
    {
        $req->validate([
            'title' => 'required|string',
            'visibility' => ['required', 'regex:/public|unlisted|private/'],
            'audio_file' => 'required|file|mimetypes:audio/mpeg',
            'thumb_file' => 'nullable|file|mimetypes:image/*'
        ], [
            'required' => 'O campo :attribute não pode estar vazio.',
            'file' => 'O campo :attribute deve ser um arquivo',
            'mimetypes' => 'O :attribute deve ser do tipo :value'
        ]);

        if (!$user = auth()->user())
            return response()->json([
                'status' => 'error',
                'message' => 'Você não está autenticado.'
            ]);

        $song = $req->file('audio_file')->storePublicly('musics', 'public');
        $thumb = '';
        if ($file = $req->file('thumb_file'))
            $thumb = $file->storePublicly('thumbs', 'public');
        
        $audio = new Mp3Info(__DIR__.'/../../../public/storage/'.$song);

        Music::create([
            'title' => $req->title,
            'user_id' => $user->id,
            'duration' => $audio->duration,
            'audio_path' => $song,
            'thumb_path' => $thumb
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Sua música foi publicada com sucesso.'
        ]);
    }

    public function update(Request $req)
    {
        if (!$user = auth()->user())
            return response()->json([
                'status' => 'error',
                'message' => 'Você não está autenticado.'
            ]);

        $req->validate([
            'id' => 'required|exists:musics',
            'title' => 'nullable|string',
            'visibility' => 'nullable|regex:/public|unlisted|private/',
            'audio' => 'nullable|mimetypes:audio/mp3',
            'thumb' => 'nullable|mimetypes:image/*'
        ], [
            'required' => 'O campo :attribute não pode estar vazio.',
            'exists' => 'Não existe uma música correspondente ao :attribute especificado.',
            'visibility.regex' => 'O campo :attribute aceita apenas os valores "public, "unlisted" e "private".',
            'mimetypes' => 'O tipo do arquivo especificado no campo :attribute não é do válido.'
        ]);

        $musicQuery = Music::where('id', $req->id)
        ->where('user_id', $user->id);

        if (!$musicQuery->exists())
            return response()->json([
                'status' => 'error',
                'message' => 'Você não é o dono desta música.'
            ]);

        $values = array_filter($req->all());

        $musicQuery->update($values);

        return response()->json([
            'status' => 'success',
            'message' => 'Informações da música atualizadas com sucesso.'
        ]);
    }

    public function delete(Request $req)
    {
        $req->validate([
            'id' => 'required|exists:musics'
        ], [
            'required' => 'O campo :attribute não pode estar vazio.',
            'exists' => 'Não existe uma música correspondente ao :attribute especificado.'
        ]);

        if (!$user = auth()->user())
            return response()->json([
                'status' => 'error',
                'message' => 'Você não está autenticado.'
            ]);
        
        $musicQuery = Music::where('id', $req->id)
        ->where('user_id', $user->id);

        if (!$musicQuery->exists())
            return response()->json([
                'status' => 'error',
                'message' => 'Não existe uma música com esse id.'
            ]);
            
        $musicQuery->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Música deletada com sucesso.'
        ]);
    }
}
