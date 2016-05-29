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
echo "Plaintext: $plaintext\n\n";

$modes = mcrypt_list_modes();
$algorithms = mcrypt_list_algorithms("/usr/local/lib/libmcrypt");

foreach (array("rijndael-128", "rijndael-192", "rijndael-256") as $cipher) {
  foreach ($modes as $mode) {
    if($mode == MCRYPT_MODE_STREAM) continue;

    $keySize = mcrypt_get_key_size ($cipher, $mode);
    $key = rand_char($keySize);

    echo "$cipher -- $mode \n";

    $iv_size = mcrypt_get_iv_size($cipher, $mode);
    $iv = mcrypt_create_iv($iv_size, MCRYPT_RAND);
    echo "Iv size ". $iv_size . "\n";

    echo "Key : " . base64_encode($key) . "\n";
    echo "IV : " . base64_encode($iv) . "\n";

    // if($mode == MCRYPT_MODE_CBC || $mode == MCRYPT_MODE_CFB || $mode == MCRYPT_MODE_OFB|| $mode == MCRYPT_MODE_CTR) {
      $ciphertext = mcrypt_encrypt($cipher, $key, $plaintext, $mode, $iv);
      $finaltext = mcrypt_decrypt($cipher, $key, $ciphertext, $mode, $iv);
    // } else {
      // $ciphertext = mcrypt_encrypt($cipher, $key, $plaintext, $mode);
      // $finaltext = mcrypt_decrypt($cipher, $key, $ciphertext, $mode);
    // }

    echo "  ciphertext: " . base64_encode($ciphertext) . "\n";
    echo "  match: " . (trim($finaltext) === $plaintext ? "YES" : "NO") . "\n\n";
  }
}
