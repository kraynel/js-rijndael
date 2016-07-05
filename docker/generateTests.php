<?php
//error_reporting(E_ERROR | E_PARSE);
function rand_char($length) {
  $random = '';
  for ($i = 0; $i < $length; $i++) {
    $random .= chr(mt_rand(33, 126));
  }
  return $random;
}

$plaintext = "hello how are you this is supposed to be long to surpass the 256 block limit so yeah let's go it's gonna take a while how are you today";
$plaintext = "$plaintext--$plaintext";

$modes = mcrypt_list_modes();
$algorithms = mcrypt_list_algorithms("/usr/local/lib/libmcrypt");

$resultArray = array(
  "plaintext" => $plaintext,
  "encoded" => array()
);

foreach (array("rijndael-128", "rijndael-192", "rijndael-256") as $cipher) {
  foreach ($modes as $mode) {
    if($mode == MCRYPT_MODE_STREAM || $mode == MCRYPT_MODE_OFB) continue;

    $keySize = mcrypt_get_key_size ($cipher, $mode);
    $key = rand_char($keySize);

    $iv_size = mcrypt_get_iv_size($cipher, $mode);
    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);

    $ciphertext = mcrypt_encrypt($cipher, $key, $plaintext, $mode, $iv);

    $resultArray["encoded"][] = array(
      "cipher" => $cipher,
      "mode" => $mode,
      "ivSize" => $iv_size,
      "iv" => base64_encode($iv),
      "key" => base64_encode($key),
      "message" => base64_encode($ciphertext)
    );
  }
}

echo 'module.exports = ';
echo json_encode($resultArray, JSON_PRETTY_PRINT);
