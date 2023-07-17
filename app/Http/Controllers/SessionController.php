<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\GlobalVars;

class SessionController extends Controller
{
    public $global = null;

    public function __construct()
    {
        $this->global = new GlobalVars();
    }

    public function index(){
        $auth = Auth()->user();
        $globalVars = $this->global->getGlobalVars();
        return Inertia::render('Dashboard', compact('auth', 'globalVars'));
    }
}
