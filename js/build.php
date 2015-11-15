<?
/*
include("src/propertyEvent.js");
include("src/main.js");
include("src/defineProperty.js");
include("src/clone.js");
*/
imports("src/main.js");

$holdstack = array();
function imports($file){
	try{
		$handle = @fopen($file, "r");
		if($handle==false){throw new Exception;};
		$lines = array();
		while(($line=fgets($handle))!==false){
			if(strpos($line, "imports(")!==false){
				$nextfile = explode("\"", $line);
				$nextfile = $nextfile[1];
				imports($nextfile);
			}elseif(!strpos($line, "//!print")){
				$line = str_replace("\r", "", $line);
				$line = str_replace("\n", "", $line);
				echo $line."\r\n";
			}
		};
		$cutfront = true;
		foreach($lines as $line){
			if($cutfront==true){
				if($line==""){
					array_shift($lines);
				}else{
					$cutfront=false;
				}
			}
		}
		$cutrear = true;
		for($i=count($lines)-1; $i>-1; $i--){
			$line = $lines[$i];
			if($cutrear==true){
				if($line==""){
					array_pop($lines);
				}else{
					$cutrear=false;
				}
			}
		}
		foreach($lines as $line){
			//echo $line."\r\n";
		}
	}catch(Exception $e){
		echo "// File '".$file."' not found.\r\n";
	}
}

?>
