---
title: PyNaCl 加密套件使用紀錄
description:  PyNaCl 使用紀錄以及基本密碼學概念
tags:
  - Programming
  - Python
  - PyNaCl
  - 密碼學
keywords:
  - Programming
  - Python
  - PyNaCl
  - 密碼學
last_update:
  date: 2024-11-20T01:49:00+08:00
  author: zsl0621
---


import ReactPlayer from "react-player";

# PyNaCl 使用紀錄以及基本密碼學概念

這篇不是教學文章！！！想看正經密碼學教學請另尋他路。

筆者大學時曾經修過密碼學的課，教授專精密碼學，並且表示全台灣還有在研究這個的不到五個了。密碼學是一個很神奇的東西，當年教到好像是 AES 還是哪種加密，對我來說就是非常 tricky，兜兜繞繞之後剛好可以變成一個攻擊者很難破解的密碼。單獨理解不困難，對我來說陌生的點在於不知道發明者如何想到的，只會算考試考的加解密就像是外貿協會只知其言不知其行，那不如用現有工具加解密就好了，而筆者對純密碼學的理解也僅只於此。

後來又在網路上看了一些憑證相關的介紹，還有證書機關爾爾，看了都覺得「這樣也可以算是介紹密碼學喔」，其實就是一個自視甚高的心態覺得自己修過密碼學與眾不同，覺得自己知道實際演算法好像很厲害（光一個加解密就教了超過兩週吧，網路文章就是公鑰私鑰沒了，我看完就開始優越感），實際上網路上教密碼學的文章都是網路組或者網頁開發等等不需要知道怎麼算的人，知道演算法實現對他們來說沒有什麼幫助，我又有什麼好覺得自己厲害的。

真正的密碼學演算法開發沒幾個人會去研究，這是純數的領域，有瞄過一眼密碼學課本的都知道筆者在說什麼。讀純數的人大概就是這樣吧，要夠強，要夠有耐心，家裡要夠有錢。

<center>
<ReactPlayer controls url="https://www.youtube.com/watch?v=NCi-VqerJlI" />
</center>

<br/>

內心戲結束，這篇應該是全網唯一一篇使用 [PyNaCl](https://github.com/pyca/pynacl) 還寫成文章的中文文章，是筆者失業太閒隨便拿來玩的紀錄。


## 加密
這裡沒有什麼 Alice Bob，因為上課教的快忘光了，只介紹實際使用時的各種元件組成。

### 對稱加密
本段落涵蓋官方文檔的 [Secret Key Encryption](https://pynacl.readthedocs.io/en/latest/secret/) 全部內容。

對稱加密的概念很簡單，拿哪把鑰匙加密就用哪把鑰匙解密，用戶必須保管好自己的鑰匙，鑰匙洩漏等同於訊息洩漏。在 PyNaCl 中，我們使用 `SecretBox` 類別完成

```py
key = nacl.utils.random(nacl.secret.SecretBox.KEY_SIZE)
box = nacl.secret.SecretBox(key)   # 產生加密用的箱子

message = b"The president will be exiting through the lower levels"
encrypted = box.encrypt(message)
plaintext = box.decrypt(encrypted)   # 使用相同的箱子解密
```


#### Nonce
每次生成密文時可以使用 nonce 避免重放攻擊，此選項可以讓同樣的訊息透過隨機的 nonce 生成不同的密文。

#### AEAD
額外傳輸一個 AAD 驗證資訊用以保護真正的密文不被竄改。AAD 可以為明文傳遞，接收傳遞雙方都知道同樣的 AAD，只要密文或 AAD 被竄改都會導致解密失敗。

### 非對稱加密
此部分包含官方文檔的 [Public Key Encryption](https://pynacl.readthedocs.io/en/latest/public/) 全部內容。

在非對稱加密中，首先伺服器和客戶端都各自生成一對兩隻公私鑰，公鑰是任何人都能知道的，私鑰則需要安全保管。這兩把金鑰的特色是「公鑰加密的訊息只有私鑰能解密」，透過這個特性可以衍生出兩種用途：

1. 加密訊息
2. 數位簽章

加密訊息相對直觀，任何人都可以使用伺服器傳來的公鑰加密自己的訊息，這份訊息只有私鑰持有者能解密，也就是伺服器。  
數位簽章則使用自己的私鑰加密，因為私鑰加密後的訊息具備唯一性，所以任何擁有公鑰的人都能確認訊息發送者身分。  

中間其實還有一些 hash 步驟，不過這不是教學文章只是簡單紀錄所以跳過。在 PyNaCl 中非對稱加密有兩種方式可以使用，分別為在意發送者的 `Box` 和不在意發送者的 `SealedBox`。

```py
# Box 範例
from nacl.public import PrivateKey, Box

# 產生私鑰後衍生公鑰
skbob = PrivateKey.generate()
pkbob = skbob.public_key
skalice = PrivateKey.generate()
pkalice = skalice.public_key

# 傳送者使用自己的私鑰和接收者的公鑰加密
bob_box = Box(skbob, pkalice)
message = b"Kill all humans"
encrypted = bob_box.encrypt(message)

# 接收者使用傳送的公鑰和自己者的私鑰解密
alice_box = Box(skalice, pkbob)
plaintext = alice_box.decrypt(encrypted)
print(plaintext.decode('utf-8'))
```

也就是說每次加密解密都需要四把鑰匙，也就是說 `Box` 方法可以驗證發送者的身分。如果我們不關心發送者是誰只要求能正確解密，可以使用 `SealedBox` 方法

```py
from nacl.public import PrivateKey, SealedBox

# 接收者生成私鑰並且衍生公鑰
skbob = PrivateKey.generate()
pkbob = skbob.public_key

# 傳遞公鑰給發送者

# 發送者使用公鑰加密訊息
sealed_box = SealedBox(pkbob)
message = b"Kill all kittens"
encrypted = sealed_box.encrypt(message)

# 私鑰解密訊息
unseal_box = SealedBox(skbob)
plaintext = unseal_box.decrypt(encrypted)
print(plaintext.decode('utf-8'))
```

`Box` 加密也可以使用 nonce 參數，而 `SealedBox` 不支援。 `SealedBox` 被設計成傳完馬上棄用的場景，發送者也無法使用自己解密自己發送的訊息（因為他沒私鑰）。


### 數位簽章
數位簽章用途如前述，用以確認密文傳送者身分。我沒有用，所以沒寫這段。官方文檔寫的非常清楚了請自行觀看。

https://pynacl.readthedocs.io/en/latest/signing/

### 雜湊
雜湊用於確認訊息完整性，良好的雜湊函式對於任意兩種不同的輸入其輸出永遠不會相同。雜湊是不可逆的，用於驗證而不是保存資料。

PyNaCl 套件也包含雜湊函式，除了常見的 sha 還有進階的 blake2b 都支援。Hash 可以用於四種情況：

1. 檢查數據是否被篡改，使用 HASHER 生成摘要 `digest` 後提供接收者比對   
2. 檢查數據完整性，使用 `sodium_memcmp`
3. `blake2b` 作為訊息鑑別碼 (MAC) 檢查完整性
4. `blake2b` 作為金鑰衍生函數

:::tip 問 ChatGPT 4o#2024/11
> 衍生金鑰有啥好處？

衍生金鑰（Key Derivation）是指通過一些數學算法或函數，從一個原始金鑰（通常是秘密密鑰）衍生出一組新的密鑰。這樣的過程通常會帶來多重安全性上的好處。為什麼不直接使用原始金鑰，而要衍生金鑰，主要基於以下幾點考量：

1. **增強安全性**
   - **避免密鑰重用**：直接使用原始金鑰會導致在多個地方使用相同的密鑰，這樣一旦某處密鑰洩露或被破解，所有使用該金鑰的系統或資料都將受到威脅。通過衍生金鑰，可以為每個加密操作或每個會話生成一個唯一的密鑰，有效避免密鑰重用問題。
   - **降低風險**：如果原始金鑰是基於某些弱資料（如密碼或低熵來源），直接使用這些金鑰會使加密系統容易受到攻擊。金鑰衍生算法（如PBKDF2、HKDF等）可以通過加入額外的鹽值（salt）、個性化參數等來增加密鑰的強度，從而保證衍生金鑰的強度。

2. **提升靈活性**
   - **會話密鑰生成**：在許多加密系統中，會話密鑰（Session Key）是一次性使用的，並且通常由衍生金鑰生成。這樣每次通信時都會有不同的密鑰，而不需要在每次建立連接時手動交換金鑰，這增加了通信的靈活性和安全性。
   - **支持多種用途**：同一個原始金鑰可以用來衍生多個金鑰，每個金鑰用於不同的用途（例如加密、身份驗證等），這樣可以減少密鑰管理的複雜度並提高系統的可擴展性。

3. **防止長期密鑰暴露**
   - **防止金鑰洩漏的後果擴大**：如果直接使用一個長期金鑰，這個金鑰可能在系統中被使用多年。一旦這個金鑰洩露或被破解，攻擊者可以不僅解密舊的消息，還能解密未來所有的消息。衍生金鑰可以確保每次加密和解密使用的密鑰是唯一且短期有效的，這樣即使金鑰洩露，也只會影響到少量的數據。

4. **提高加密算法的效率**
   - **加強抗分析性**：使用金鑰衍生算法可以增加對加密系統的抗攻擊能力。這些算法通常具有一定的計算開銷，這使得暴力破解等攻擊變得更加困難。例如，利用 PBKDF2、HKDF 等算法衍生金鑰時，可以通過多次迭代來加強計算的難度，進一步防止暴力破解。

為何不直接使用原始金鑰？
使用金鑰衍生的目的是為了提高系統的靈活性、安全性和可管理性。直接使用原始金鑰的風險如下：
   - **密鑰重用**：在多個加密操作中重複使用相同的金鑰，會使得金鑰的暴露風險增加。這也可能使得攻擊者更容易從已知的密文中推測出密鑰。
   - **缺乏變化性**：如果一個金鑰長期使用，那麼當這個金鑰暴露時，所有依賴它的資料都會面臨安全風險。金鑰衍生可以每次生成新的密鑰，降低風險。
   - **密鑰管理問題**：使用一個長期金鑰進行所有操作會使得密鑰的管理變得困難。特別是當系統規模變大時，衍生金鑰可以讓每個用戶和每個操作有不同的密鑰，簡化管理。

<h2>**結論**</h2>
使用衍生金鑰而不是直接使用原始金鑰，可以顯著提升系統的安全性和靈活性。這樣的設計使得每次加密操作都能使用唯一的密鑰，有效減少了密鑰重用的風險，也能防止密鑰洩露造成的長期影響。
:::


### 密碼雜湊
使用強力的雜湊函式可以讓我們安全的加密和驗證密碼，比如說儲存密碼時使用雜湊，即使密碼庫被破解也只是無法還原的哈希值。密碼雜湊函式是比一般雜湊更強力的雜湊函式，專門用於抵抗各種破解方式，一般雜湊則適用於快速查詢驗證。

截至目前為止[最強大的密碼雜湊函數](https://github.com/EasonWang01/Introduction-to-cryptography/blob/master/1.1%20Bcrypt%E3%80%81PBKDF2%E3%80%81Scrypt%E3%80%81Argon2.md)是 argon2id，其前身 argon2 是 2015 密碼哈希競賽冠軍，並且集結衍生版本 argon2i 抗旁路攻擊以及 argon2d 對抗 GPU 硬體加速攻擊的高級版本。如果 argon2 不可用（實際上他真的很吃效能），可以使用低一階的 scrypt，[最低階的雜湊函式](https://www.liuvv.com/p/4fe35076.html)的 PBKDF2 PyNaCl 一樣也有實現。

使用密碼雜湊時要注意，在 PyNaCl 中已經幫你算好特定數值，舉例來說，原版的 scrypt 有 password/salt/N/r/p 等參數，分別是密碼/鹽/記憶體空間/記憶體區塊大小/平行計算程度等等，然而在 `nacl.pwhash.scrypt.kdf` 中，N/r/p 等參數被簡化為 opslimit 和 memlimit。

至於鹽 (salt) 則是類似於 nonce 的角色，也是隨機數據，用於保證兩個相同密碼雜湊結果不同，需要和密碼雜湊的結果一起儲存才可以正確驗證解密。

### base64 編碼
[Encoders](https://pynacl.readthedocs.io/en/latest/encoding/)

PyNaCl 也整合 Python 中內建的一些編碼函式作為工具整合使用，如 base64 編碼。

base64 編碼用於將二進制檔案轉換成 64 個英數字可表達的字串，用於在限制僅能使用字串傳遞時，可以正確的把二進制檔案轉換成字串並且還原，這不是一個加密編碼只是轉換數據類型時使用的編碼。

這裡用 Python 內建函式示範，使用方式為

```py
import base64

# 二進制表達的 "hello world" 字串，等同於 byte_data = text.encode('utf-8')
byte_data = b"hello world"

# 轉換為字串
encoded_str = base64.b64encode(byte_data).decode('utf-8')

# 轉回 byte
decoded_bytes = base64.b64decode(encoded_str.encode('utf-8'))

print(f"Encoded: {encoded_str}")
print(f"Decoded: {decoded_bytes}")

# Encoded: aGVsbG8gd29ybGQ=
# Decoded: b'hello world'
```

## 實作
以下是根據 PyNaCl 實現的密碼保護架構，採用三層金鑰架構完成縱深防禦：

第一層使用作業系統的安全亂數源 os.urandom 生成 32 位元的 encryption_key 和 salt 用以衍生金鑰，衍生金鑰函式 (KDF) 採用最先進的 argon2id 演算法，此演算法結合最先進的 Argon2i 和 Argon2d，能有效防禦 side-channel resistant 和對抗 GPU 暴力破解。

中間層使用主金鑰保護非對稱金鑰對，使用 XSalsa20-Poly1305 演算法加上 24-byte nonce 防禦密碼碰撞，XSalsa20 擴展了 Salsa20，在原本高效、不需要硬體加速的優勢上更進一步強化安全性。Poly1305 確保密碼完整性，防止傳輸過程中被篡改的問題。

最外層以 SealBox 實現加密，採用業界標準 Curve25519 演算法提供完美前向保密，Curve25519 只需更短的金鑰就可達到和 RSA 同等的安全強度。

最後將金鑰儲存在設有安全權限管理的資料夾，並將加密材料分開儲存於獨立的 .env 檔案中。

> 開始獻醜，可以看到實作的部分都是成對出現，加解密主金鑰、加解密私鑰、加解密密碼以及兩個工具方法。

```py
import base64
import ctypes
import secrets
from dataclasses import dataclass
from logging import Logger

from nacl.public import PrivateKey, PublicKey, SealedBox
from nacl.pwhash import argon2id
from nacl.secret import SecretBox
from nacl.utils import EncryptedMessage, random as nacl_random

from ..common import EncryptionConfig, SecurityError


@dataclass
class KeyPair:
    private_key: PrivateKey
    public_key: PublicKey


class Encryptor:
    """Managing encryption and decryption operations."""

    def __init__(self, logger: Logger, encrypt_config: EncryptionConfig) -> None:
        self.logger = logger
        self.encrypt_config = encrypt_config

    def encrypt_master_key(self, master_key: bytes) -> tuple[bytes, bytes, bytes]:
        salt = secrets.token_bytes(self.encrypt_config.salt_bytes)
        encryption_key = secrets.token_bytes(self.encrypt_config.key_bytes)
        derived_key = self.derive_key(encryption_key, salt)

        box = SecretBox(derived_key)
        nonce = nacl_random(self.encrypt_config.nonce_bytes)
        encrypted_master_key = box.encrypt(master_key, nonce)

        derived_key = bytearray(len(derived_key))
        self.logger.info("Master key encryption successful")
        return encrypted_master_key, salt, encryption_key

    def decrypt_master_key(
        self,
        encrypted_master_key: bytes,
        salt: str,
        encryption_key: str,
    ) -> bytes:
        salt_b64 = base64.b64decode(salt)
        enc_key_b64 = base64.b64decode(encryption_key)
        derived_key = self.derive_key(enc_key_b64, salt_b64)
        box = SecretBox(derived_key)

        master_key = box.decrypt(encrypted_master_key)

        self.logger.info("Master key decryption successful")
        return master_key

    def encrypt_private_key(self, private_key: PrivateKey, master_key: bytes) -> EncryptedMessage:
        box = SecretBox(master_key)
        nonce = nacl_random(self.encrypt_config.nonce_bytes)
        return box.encrypt(private_key.encode(), nonce)

    def decrypt_private_key(self, encrypted_private_key: bytes, master_key: bytes) -> PrivateKey:
        box = SecretBox(master_key)
        private_key_bytes = box.decrypt(encrypted_private_key)
        private_key = PrivateKey(private_key_bytes)
        cleanup([private_key_bytes])
        return private_key

    def encrypt_password(self, password: str, public_key: PublicKey) -> str:
        sealed_box = SealedBox(public_key)
        encrypted = sealed_box.encrypt(password.encode())
        self.logger.info("Password encryption successful")
        return base64.b64encode(encrypted).decode("utf-8")

    def decrypt_password(self, encrypted_password: str, private_key: PrivateKey) -> str:
        try:
            encrypted = base64.b64decode(encrypted_password)
            sealed_box = SealedBox(private_key)
            decrypted = sealed_box.decrypt(encrypted)
            return decrypted.decode()
        except Exception as e:
            self.logger.error("Password decryption failed: %s", str(e))
            raise SecurityError from e

    def derive_key(self, encryption_key: bytes, salt: bytes) -> bytes:
        return argon2id.kdf(
            self.encrypt_config.key_bytes,
            encryption_key,
            salt,
            opslimit=self.encrypt_config.kdf_ops_limit,
            memlimit=self.encrypt_config.kdf_mem_limit,
        )

    def validate_keypair(self, private_key: PrivateKey, public_key: PublicKey) -> None:
        try:
            test_data = b"test"
            sealed_box = SealedBox(public_key)
            sealed_box_priv = SealedBox(private_key)

            encrypted = sealed_box.encrypt(test_data)
            decrypted = sealed_box_priv.decrypt(encrypted)

            if decrypted != test_data:
                raise SecurityError
        except Exception as e:
            self.logger.error("Key pair validation failed: %s", str(e))
            raise SecurityError from e


def cleanup(sensitive_data: list[bytes]) -> None:
    for data in sensitive_data:
        length = len(data)
        buffer = ctypes.create_string_buffer(length)
        ctypes.memmove(ctypes.addressof(buffer), data, length)
        ctypes.memset(ctypes.addressof(buffer), 0, length)
        del buffer
```


我們還可以使用 [keyring](https://github.com/jaraco/keyring) 套件將主金鑰交給作業系統保管，這樣就有四重保障：作業系統防護主金鑰存取，兩個加密材料保護主金鑰解密，主金鑰保護私鑰解密，私鑰保護密碼解密。加密材料也可以分散儲存避免洩漏。

至於這裡沒用 keyring 的原因是發現在我的架構中每次檢查是否存在金鑰，沒有就會自動建立，這樣會造成即使只是把金鑰檔案移走再放回來，只要中間執行過腳本又會再生成一次主金鑰覆蓋 keyring，導致把原本的金鑰放回後新的主金鑰無法解密舊的私鑰，懶得再改程式就算了先放這樣。

如果前面是普通獻醜，這邊就是超醜，放上來讓大家笑一下。這是現在能找到最舊的版本，這還是有優化過的，因為最早最爛的版本被我自己 amend 掉了。

<details>

<summary>超長 method </summary>

```py
import base64
import os
import secrets

from dotenv import load_dotenv, set_key
from nacl.public import PrivateKey, PublicKey, SealedBox
from nacl.pwhash import scrypt
from nacl.secret import SecretBox
from nacl.utils import random as nacl_random

from .config import ConfigManager


class SecurityError(Exception):
    pass


class KeyManager:
    KEY_BYTES = 32
    SALT_BYTES = 32
    NONCE_BYTES = 24
    KEY_FOLDER = os.path.join(ConfigManager.get_system_config_dir(), ".keys")
    custom_env_path = os.path.join(ConfigManager.get_system_config_dir(), ".env")
    MASTER_KEY_FILE = os.path.join(KEY_FOLDER, "master_key.enc")

    def __init__(self) -> None:
        self.__ensure_secure_folder()

    def __ensure_secure_folder(self) -> None:
        if not os.path.exists(self.KEY_FOLDER):
            os.makedirs(self.KEY_FOLDER, mode=0o700)
        else:
            os.chmod(self.KEY_FOLDER, 0o700)

    def __secure_random_bytes(self, size: int) -> bytes:
        return secrets.token_bytes(size)

    def start_up(self) -> None:
        private_key_path = os.path.join(self.KEY_FOLDER, "private_key.pem")
        public_key_path = os.path.join(self.KEY_FOLDER, "public_key.pem")
        if not os.path.exists(private_key_path) or not os.path.exists(public_key_path):
            self.generate_keypair()

    def encrypt_master_key(self, master_key: bytes) -> None:
        salt = self.__secure_random_bytes(self.SALT_BYTES)
        encryption_key = self.__secure_random_bytes(self.KEY_BYTES)

        # 使用 scrypt 將 encryption_key 和 salt 轉換為主金鑰加密金鑰
        derived_key = scrypt.kdf(
            self.KEY_BYTES, encryption_key, salt, opslimit=2**20, memlimit=2**26
        )
        box = SecretBox(derived_key)
        nonce = nacl_random(self.NONCE_BYTES)
        encrypted_master_key = box.encrypt(master_key, nonce)

        # 儲存加密後的主金鑰到檔案
        with open(self.MASTER_KEY_FILE, "wb") as f:
            f.write(encrypted_master_key)
        os.chmod(self.MASTER_KEY_FILE, 0o400)

        # 將 salt 和 encryption_key 存入 .env
        load_dotenv(self.custom_env_path)
        salt_base64 = base64.b64encode(salt).decode("utf-8")
        encryption_key_base64 = base64.b64encode(encryption_key).decode("utf-8")
        set_key(self.custom_env_path, "SALT", salt_base64)
        set_key(self.custom_env_path, "ENCRYPTION_KEY", encryption_key_base64)

        # 清理敏感數據
        master_key = bytearray(len(master_key))
        encryption_key = bytearray(len(encryption_key))
        derived_key = bytearray(len(derived_key))

    def decrypt_master_key(self) -> bytes:
        # 從 .env 中載入 salt 和 encryption_key
        load_dotenv(self.custom_env_path)
        salt_base64 = os.getenv("SALT")
        encryption_key_base64 = os.getenv("ENCRYPTION_KEY")

        if not salt_base64 or not encryption_key_base64:
            raise SecurityError("Either SALT in .env or ENCRYPTION_KEY not found")

        salt = base64.b64decode(salt_base64)
        encryption_key = base64.b64decode(encryption_key_base64)

        # 使用 scrypt 還原 derived_key
        derived_key = scrypt.kdf(
            self.KEY_BYTES, encryption_key, salt, opslimit=2**20, memlimit=2**26
        )

        # 載入並解密主金鑰
        with open(self.MASTER_KEY_FILE, "rb") as f:
            encrypted_master_key = f.read()

        box = SecretBox(derived_key)
        master_key = box.decrypt(encrypted_master_key)

        encryption_key = bytearray(len(encryption_key))
        derived_key = bytearray(len(derived_key))

        return master_key

    def generate_keypair(self) -> None:
        try:
            self.__ensure_secure_folder()

            private_key = PrivateKey.generate()
            public_key = private_key.public_key

            # 生成主金鑰並加密
            master_key = self.__secure_random_bytes(self.KEY_BYTES)
            self.encrypt_master_key(master_key)

            # 加密私鑰
            box = SecretBox(master_key)
            nonce = nacl_random(self.NONCE_BYTES)
            encrypted_private_key = box.encrypt(private_key.encode(), nonce)

            # 分開儲存各個組件
            private_key_path = os.path.join(self.KEY_FOLDER, "private_key.pem")
            public_key_path = os.path.join(self.KEY_FOLDER, "public_key.pem")

            # 儲存加密後的私鑰
            with open(private_key_path, "wb") as f:
                f.write(encrypted_private_key)
            os.chmod(private_key_path, 0o400)

            # 儲存公鑰
            with open(public_key_path, "wb") as f:
                f.write(public_key.encode())
            os.chmod(public_key_path, 0o644)

            print("Key pair has been successfully generated and stored.")

        except Exception as e:
            raise SecurityError(f"Key generation failed: {e!s}") from e

    def load_keys(self) -> tuple[PrivateKey, PublicKey]:
        try:
            private_key_path = os.path.join(self.KEY_FOLDER, "private_key.pem")
            public_key_path = os.path.join(self.KEY_FOLDER, "public_key.pem")

            for path in [private_key_path, public_key_path, self.MASTER_KEY_FILE]:
                if not os.path.exists(path):
                    raise SecurityError(f"Required key file not found: {path}")

            # 載入並解密主金鑰
            master_key = self.decrypt_master_key()

            # 載入加密的私鑰
            with open(private_key_path, "rb") as f:
                encrypted_private_key = f.read()

            # 載入公鑰
            with open(public_key_path, "rb") as f:
                public_key_bytes = f.read()

            # 解密私鑰
            box = SecretBox(master_key)
            private_key_bytes = box.decrypt(encrypted_private_key)

            private_key = PrivateKey(private_key_bytes)
            public_key = PublicKey(public_key_bytes)

            # 清理敏感數據
            master_key = bytearray(len(master_key))
            private_key_bytes = bytearray(len(private_key_bytes))

            # 驗證金鑰
            test_data = b"test"
            sealed_box = SealedBox(public_key)
            sealed_box_priv = SealedBox(private_key)

            encrypted = sealed_box.encrypt(test_data)
            decrypted = sealed_box_priv.decrypt(encrypted)

            if decrypted != test_data:
                raise SecurityError("Key pair validation failed.")

            return private_key, public_key

        except Exception as e:
            raise SecurityError(f"Key loading failed: {e!s}") from e

    def encrypt_password(self, public_key: PublicKey, password: str) -> str:
        sealed_box = SealedBox(public_key)
        encrypted = sealed_box.encrypt(password.encode())
        return base64.b64encode(encrypted).decode("utf-8")

    def decrypt_password(self, private_key: PrivateKey, encrypted_password: str) -> str:
        encrypted = base64.b64decode(encrypted_password)
        sealed_box = SealedBox(private_key)
        decrypted = sealed_box.decrypt(encrypted)
        return decrypted.decode()
```

</details>


## 結語
才寫了一篇[套件管理工具比較](/docs/python/virtual-environment-management-packages-comparison)在講選多人用的就對了，但這裡我偏偏選少人用的，因為比較酷。

而且最常見的 [cryptography](https://pypi.org/project/cryptography/) 太多人講檔案又太大 (23MB) 還不支援 ED25519，另外一個也很多人用的 [pycryptodome](https://pypi.org/project/pycryptodome/) 也要 12.6MB，PyNaCl 才 4.9MB 又提供包含 Curve25519, XSalsa20-Poly1305, argon2id 等先進演算法，再加上 keyring 也僅有 1.1MB，兩個加起來還不到這些套件的一半加密演算法又強大，不選他選誰（其實只是又想特立獨行了對吧！）

最後自己也只會拿現成的東西兜一兜，欸不是，優越老半天最後是在歧視自己啊XD，人果然還是要謙虛。

> 文章中範例來自 PyNaCl 官方文檔，基於 Apache-2.0 授權。
