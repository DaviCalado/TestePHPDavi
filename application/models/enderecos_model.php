<?php
class Enderecos_Model extends MY_Model{
    public function __construct() {
        parent::__construct();
        $this->table = 'endereco';
    }
}