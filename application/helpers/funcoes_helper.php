<?php 
//Funcoes Auxiliares PHP
function completaURL(){
	$dominio = $_SERVER['HTTP_HOST'];
	$url     = "http://" . $dominio. $_SERVER['REQUEST_URI'];
	if(strpos($url,'index.php/principal/') !== FALSE){
		return;
	}else{
		return 'index.php/principal/';	
	}
}
?>
