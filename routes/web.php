<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// The Assemble3 editor is a static build in public/editor. Under Apache the
// folder is served directly (DirectoryIndex), so this route only matters for
// `php artisan serve` and as a fallback. The editor uses relative asset URLs,
// so it must be reached with the trailing slash.
Route::get('/editor', function (Request $request) {
    $index = public_path('editor/index.html');
    abort_unless(file_exists($index), 404, 'The editor is not built yet (see deploy/build-editor.sh).');

    if (! str_ends_with($request->getRequestUri(), '/')) {
        return response('', 301)->header('Location', '/editor/');
    }

    return response()->file($index, ['Cache-Control' => 'no-cache']);
});
