<link rel="stylesheet" type="text/css" href="<?php echo base_url()?>template/css/bootstrap/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="<?php echo base_url()?>template/css/estilo.css" />
<?php 
	if(empty($paciente['id'])){
		  $page 	   = base_url().'index.php/Principal/cadastrar/';
		  $nome 	   = '';
		  $nome_mae    = '';
		  $nome_pai    = '';
		  $email       = '';
		  $status      = '';
		  $rua         = '';
		  $bairro      = '';
		  $status_e    = '';
		  $id          = '';
		  $endereco_id = '';
		  $tipo        = 'Cadastro';
     }else{
		  $page 	   = base_url().'index.php/Principal/editar/'.$paciente['id'].'/'.$paciente['endereco_id'].'/';
		  $nome 	   = $paciente['nome'];
		  $nome_mae    = $paciente['nome_mae'];
		  $nome_pai    = $paciente['nome_pai'];
		  $email       = $paciente['email'];
		  $status      = $paciente['status'];
		  $rua         = $endereco['rua'];
		  $bairro      = $endereco['nome_bairro'];
		  $status_e    = $endereco['status'];
		  $id 		   = $paciente['id'];
		  $endereco_id = $paciente['endereco_id'];
		  $tipo        = 'Atualização';
		  
     }
?>
<div style="padding-left:33px" class="alert alert-success">
    <div class="row">
        <div class="col-sm-4 titulo"><b><?php echo $tipo?> de Pacientes</b></div>
    </div>
</div>
<?php if($this->session->flashdata('error') == TRUE){ ?>
    <div class="alert alert-danger"><?php echo $this->session->flashdata('error'); ?></div>
<?php }?>
<?php if ($this->session->flashdata('success') == TRUE){?>
    <div class="alert alert-success"><?php echo $this->session->flashdata('success'); ?></div>
<?php }?>
<div class="row" style="padding-left:50px">
    <form action="<?php echo $page?>"  method="post">
         <div class="row">
             <div class="col-sm-4">Nome</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         	 	<input type="text" name="nome" value="<?php echo $nome;?>" class="form-control"/>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Nome Mãe</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         	 	<input type="text" name="nome_mae" value="<?php echo $nome_mae?>" class="form-control"/>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Nome Pai</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         	 	<input type="text" name="nome_pai" value="<?php echo $nome_pai?>" class="form-control"/>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">E-mail</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         	 	<input type="text" name="email" value="<?php echo $email?>" class="form-control" style="width:100%"/>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Status Paciente</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
                 <select name="status" class="form-control">
                    <option value="1" <?php if($status == 1) echo'SELECTED';?>>Ativo</option>
                    <option value="0" <?php if($status == 0) echo'SELECTED';?>>Inativo</option>
                 </select>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Endereço</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         		<input type="text" name="rua" value="<?php echo $rua?>" class="form-control"/>
         	 </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Bairro</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
         		<input type="text" name="nome_bairro" value="<?php echo $bairro?>" class="form-control"/>
             </div>
         </div>
         <div class="row">
             <div class="col-sm-4">Status Endereço</div>
         </div>
         <div class="row">
         	 <div class="col-sm-3">
                 <select name="status_endereco" class="form-control">
                    <option value="1" <?php if($status_e == 1) echo'SELECTED';?>>Ativo</option>
                    <option value="0" <?php if($status_e == 0) echo'SELECTED';?>>Inativo</option>
                 </select>
             </div>
         </div>
         <input type="hidden" name="id" value="<?php echo $id?>"/>
         <input type="hidden" name="endereco_id" value="<?php echo $endereco_id?>"/>
         <div class="row" style="padding-top:10px">
             <div class="col-sm-2"><input type="submit" value="Salvar" class="btn btn-info" /></div>
             <div class="col-sm-4" style="padding-left:43px"><input type="button" value="Voltar" class="btn btn-warning" onclick="window.location='<?php echo base_url().'index.php/Principal/';?>index'"/></div>
         </div>
    </form> 
</div>