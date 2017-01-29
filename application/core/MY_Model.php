<?php
if (!defined('BASEPATH')) exit('No direct script access allowed');
class MY_Model extends CI_Model {
  
  var $table = "";
  
    public function __construct() {
		parent::__construct();
	}

	public function inserir($data){
		return $this->db->insert($this->table, $data);
	}

	public function atualizar($id, $data){
		if(empty($id) || !isset($data)){
			return false;
		}
		$this->db->where('id', $id);
		return $this->db->update($this->table, $data);
	}

	public function excluir($id){
		if(empty($id)){
			return false;
		}
		$this->db->where('id', $id);
		return $this->db->delete($this->table);
	}

	public function pega_dados_pelo_id($id){
		if(empty($id)){
			return false;
		}
		
		$this->db->where('id', $id);
		$query = $this->db->get($this->table);
		if($query->num_rows() > 0) {
			return $query->row_array();
		}else{
			return null;
		}
	}

	public function pega_todos_dados($sort = 'id', $order = 'asc') {
		$this->db->order_by($sort, $order);
		$query = $this->db->get($this->table);
		if($query->num_rows() > 0) {
			return $query->result_array();
		}else{
			return null;
		}
	}
	
}