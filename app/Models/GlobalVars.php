<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use stdClass;

class GlobalVars extends Model
{
    use HasFactory;

    public $globalVars;

    function __construct()
    {
        $this->globalVars = new stdClass();
        //$this->globalVars->urlRoot = "https://tucasabonita.site/";
        $this->globalVars->urlRoot = "https://tucasabonita.site/";

        // $this->globalVars->myUrl="http://192.168.20.20:8000/";
        $this->globalVars->myUrl = "http://heladeria.test/";

        $this->globalVars->dirImagenesCategorias = "C:/laragon\www/heladeria/public/Images/Categories/";
        // $this->globalVars->dirImagenesCategorias = "/home/u629086351/domains/heladeria.online/public_html/public/Images/Categories/";

        $this->globalVars->urlImagenesCategorias = $this->globalVars->myUrl."Images/Categories/";
        // $this->globalVars->urlImagenesCategorias = "https://heladeria.online/Images/Categories/";

        $this->globalVars->dirImagenes = "C:\/laragon\www\/heladeria\/public\Images\/Products\/";
        //  $this->globalVars->dirImagenes = "/home/u629086351/domains/heladeria.online/public_html/Images/Products/";

        /* Se debe crear una url para las imagenes porque <img /> lee url no directorios.*/
        $this->globalVars->urlImagenes = $this->globalVars->myUrl."Images/Products/";
        // $this->globalVars->urlImagenes="http://heladeria.test/Images/Products/";
    }


    public function getGlobalVars()
    {
        return $this->globalVars;
    }
}