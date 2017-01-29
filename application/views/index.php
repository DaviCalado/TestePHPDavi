<link rel="stylesheet" type="text/css" href="<?php echo base_url()?>template/css/bootstrap/css/bootstrap.css" />
<link rel="stylesheet" type="text/css" href="<?php echo base_url()?>template/css/estilo.css" />
<div style="padding-left:20px" class="alert alert-success">
	<div class="row">
    	<div class="col-sm-4 titulo"><b>Listagem de Pacientes</b></div>
        <div class="col-sm-4"></div>
        <div class="col-sm-4"><button type="button" class="btn btn-success" onclick="window.location='<?php echo base_url().'index.php/Principal/';?>cadastrar'">Incluir</button></div>
    </div>
</div>
<div style="padding-left:20px">
   <?php if(empty($pacientes)){?>
              <div class="row">
                  <div class="col-sm-12 alert alert-danger">Não existe nenhum paciente cadastrado!</div>
              </div>
   <?php }else{?>
   			  <div class="row alert" style="padding-bottom:0px">
                  <div class="col-sm-4"><b>Nome</b></div>
                  <div class="col-sm-4"><b>E-mail</b></div>
                  <div class="col-sm-4"><b>Ações</b></div>
              </div>
        <?php foreach($pacientes as $paciente){?>
                <div class="row alert alert-info">
                    <div class="col-sm-4"><?php echo $paciente['nome'];?></div>
                    <div class="col-sm-4"><?php echo $paciente['email'];?></div>
                    <div class="col-sm-4"><a href="<?php echo base_url().'index.php/Principal/'?>editar/<?php echo $paciente['id']?>/<?php echo $paciente['endereco_id']?>/"><span title="Editar" class="glyphicon glyphicon-pencil"></span></a> <a href="#" onclick="excluir('<?php echo $paciente['id']?>','<?php echo $paciente['endereco_id']?>')"><span title="Excluir" class="glyphicon glyphicon-trash"></span></a></div>
                </div>
        <?php } ?>
   <?php } ?>
</div>
<script>
	function excluir(paciente_id,endereco_id){
		if(confirm('Tem certeza que deseja excluir este paciente?')){
			window.location = 'excluir/'+paciente_id+'/'+endereco_id+'/'
		}
	}
</script>