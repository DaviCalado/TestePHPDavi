<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Principal extends CI_Controller {
	
	public function index(){
		$data['pacientes'] = $this->pacientes_model->pega_todos_dados('nome');
		$this->load->view('index', $data);
    }
	
	public function cadastrar(){
		if($this->input->post()){
			$validar = self::validar();
			if(!$validar){
				$this->session->set_flashdata('error', validation_errors('<p>','</p>'));
			}else{
				//Endereço
				$data_e['rua']   	   = $this->input->post('rua');
				$data_e['nome_bairro'] = $this->input->post('nome_bairro');
				$data_e['status']      = $this->input->post('status_endereco');
				$data_e['data']        = date('Y-m-d');

				try{
					$this->db->trans_start();
					if($this->enderecos_model->inserir($data_e)){
						//Id do Endereço inserido
						$endereco_id = $this->db->insert_id();
						
						//Paciente
						$data_p['nome'] 	   = $this->input->post('nome');
					    $data_p['nome_mae']    = $this->input->post('nome_mae');
					    $data_p['nome_pai']    = $this->input->post('nome_pai');
					    $data_p['email'] 	   = $this->input->post('email');
						$data_p['status'] 	   = $this->input->post('status');
					    $data_p['data']        = date('Y-m-d');
						$data_p['endereco_id'] = $endereco_id; 
						if($this->pacientes_model->inserir($data_p)){
							$this->db->trans_complete();
							$this->session->set_flashdata('success', 'Paciente inserido com sucesso.');
						}else{
							throw new Exception();
						}
					}else{
						throw new Exception();
					}
				}catch(Exception $ex){
					$this->db->trans_complete();
					$this->session->set_flashdata('error', 'Não foi possível inserir o paciente.');
				}
			}
			redirect(base_url().'index.php/Principal/cadastrar');
		}else{
			$this->load->view('cadastrar');
		}
	}	

	public function editar($id_paciente,$id_endereco){
		if($this->input->post()){
			$validar = self::validar();
			if(!$validar){
				$this->session->set_flashdata('error', validation_errors('<p>','</p>'));
			}else{
				//Endereço
				$data_e['rua']   	   = $this->input->post('rua');
				$data_e['nome_bairro'] = $this->input->post('nome_bairro');
				$data_e['status']      = $this->input->post('status_endereco');
				$data_e['data']        = date('Y-m-d');

				try{
					$this->db->trans_start();
					if($this->enderecos_model->atualizar($id_endereco,$data_e)){
						$endereco_id = $this->db->insert_id();

						$data_p['nome'] 	   = $this->input->post('nome');
					    $data_p['nome_mae']    = $this->input->post('nome_mae');
					    $data_p['nome_pai']    = $this->input->post('nome_pai');
					    $data_p['email'] 	   = $this->input->post('email');
						$data_p['status'] 	   = $this->input->post('status');
					    $data_p['data']        = date('Y-m-d');
						//$data_p['endereco_id'] = $endereco_id;
						if($this->pacientes_model->atualizar($id_paciente,$data_p)){
							$this->db->trans_complete();
							$this->session->set_flashdata('success', 'Paciente atualizado com sucesso.');
						}else{
							throw new Exception();
						}
					}else{
						throw new Exception();
					}
				}catch(Exception $ex){
					$this->db->trans_complete();
					$this->session->set_flashdata('error', 'Não foi possível atualizar o paciente.');
				}
			}
		}
		$dados['paciente'] = $this->pacientes_model->pega_dados_pelo_id($id_paciente);
		$dados['endereco'] = $this->enderecos_model->pega_dados_pelo_id($id_endereco);
		$this->load->view('cadastrar', $dados);
	}	

	public function excluir($id_paciente,$id_endereco){
		try{
			$this->db->trans_start();
			if($this->enderecos_model->excluir($id_endereco)){
				if($this->pacientes_model->excluir($id_paciente)){
					$this->session->set_flashdata('success', 'Paciente excluído com sucesso.');
					$this->db->trans_complete();
				}else{
					throw new Exception();
				}
			}else{
				throw new Exception();
			}
		}catch(Exception $ex){
			$this->db->trans_complete();
			$this->session->set_flashdata('error', 'Não foi possível excluir o paciente.');
		}
		redirect(base_url().'index.php/Principal/');
	}

	private function validar(){
		$this->form_validation->set_rules('nome', 'Nome', 'required|min_length[2]');
		$this->form_validation->set_rules('email', 'Email', 'required|valid_email');
		$this->form_validation->set_rules('rua', 'Rua', 'required');
		return $this->form_validation->run();
	}
}