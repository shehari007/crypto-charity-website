import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
<>
  <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossorigin="anonymous"/>
    <script language="javascript" type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script language="javascript" type="text/javascript"
      src="https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.5/web3.min.js"></script>
    <script language="javascript" type="text/javascript" src="charity_abi.js"></script>
    <script language="javascript" type="text/javascript" src="myNFTabi.js"></script>
  </>


function App() {


  var ContractAddress1 = "0xD0d2fF9019af985C2438b81bE3796BF9C88451Cc";
  var ContractAddress2 = "0x6AD593BC5bB79556456B8c2fd0A576D1431d9282"
  var top_Urun_sayisi;
  var selected_wallet_address;
  var toplamContractPara = 0;

  async function loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      window.ethereum.enable();

    }
  }

  async function loadContract() {
    return await new window.web3.eth.Contract(charity, ContractAddress1);
    return await new window.web3.eth.Contract(nft, ContractAddress2);

  }

  async function getCurrentAccount(accountindex = 0) {

    var accounts = await ethereum.request({ method: "eth_requestAccounts" }).then(
      alert("Metamask baglandi, Urun listesi yukleniyor lutfen bekleyeniz")
    )
    console.log(accounts);
    document.getElementById("adres").value = accounts;
    selected_wallet_address = await accounts[accountindex];
    await top_Urun_sayisi1();
    await urun_Mapping().then(
      alert("Urun Listesi Geitrmis")
    )
  }

  async function load() {
    await loadWeb3();
    window.contract = await loadContract();
  }

  async function urun_ekle() {

    var urunAdi = document.getElementById("UrunAdi").value;
    var urunStok = document.getElementById("UrunStok").value;
    var respond = await contract.methods.urun_ekle(urunAdi, urunStok).send({ from: selected_wallet_address });

    if (respond["blockHash"]) {
      alert("Yeni Ürün Eklendi");
    } else {
      alert("Hata oluştu");
    }
    //console.log(respond);
    await top_Urun_sayisi1();
    await urun_Mapping();

  }

  async function top_Urun_sayisi1() {
    var respond = await window.contract.methods.toplam_urun_sayisi().call({ from: selected_wallet_address });
    top_Urun_sayisi = respond;
  }

  async function urun_Mapping() {
    var UrunAdi = '';

    for (i = 0; i < top_Urun_sayisi; i++) {
      var respond = await window.contract.methods.urun_isim(i).call({ from: selected_wallet_address });
      var respond2 = await window.contract.methods.urun_stok(i).call({ from: selected_wallet_address });
      //console.log(respond);
      //console.log(respond2);
      UrunAdi += '<input type="button" class="btn btn-primary" value="' + respond + '\n' + 'Pkt:' + ' ' + respond2 + '" onclick="Satin_Al(' + i + ');">';
    }
    document.getElementById("aday_listesi").innerHTML = UrunAdi;
  }

  async function stokGetir() {

    for (i = 0; i < top_Urun_sayisi; i++) {
      var respond2 = await window.contract.methods.urun_stok(i).call({ from: selected_wallet_address });
      //console.log(respond2);

    }
  }

  async function stok_kontrol(id) {
    var respond2 = await window.contract.methods.urun_stok(id).call({ from: selected_wallet_address });
    console.log(respond2);
    return respond2;
  }




  async function Satin_Al(id) {

    var kacTane = await document.getElementById("kac_tane").value;
    console.log(kacTane);

    if (kacTane === '0') {
      alert("Donation amount must be greater than 0");
    } else {
      //var hex= '0x'+parseInt('1000000000000000',10).toString(16);
      var tutar = kacTane;
      //console.log(hex);
      var respond = await contract.methods.satinAl(id).send({
        from: selected_wallet_address,
        value: Web3.utils.toWei(tutar.toString(), "ether"),
        gas: 210000,
        gasPrice: 8000000000
      });

      await urun_Mapping();
      if (respond["blockHash"]) {
        alert("Donation Successfull");
        toplamContractPara = + tutar;
        console.log(toplamContractPara);
        //document.getElementById("totalpara").value=toplamContractPara;
      } else {
        alert("Something went wrong, try again");
      }

    }
  }
  async function Stok_Ekle() {
    var ID = document.getElementById("urun_id").value;
    var respond = await window.contract.methods.withdraw().send({ from: selected_wallet_address });
    if (respond["blockHash"]) {
      alert("Checkout Completed");
      toplamContractPara = 0;
    } else {
      alert("Error check console log");
    }
    await urun_Mapping();

  }



  window.addEventListener('load', function () {
    load();
  });
  return (
    <div>
      <nav class="navbar navbar-expand-lg bg-warning" style="color: white;">
        <div class="container-fluid">
          <a style="font-weight: 500 ;" class="navbar-brand" href="#">Animal Charity Foundation</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link" aria-current="page" href="/index.html">Home</a>
              <a class="nav-link" href="/about.html">About Us</a>
              <a class="nav-link" href="#">Pricing</a>
              <a class="nav-link" href="/login.html">Admin Login</a>
            </div>
          </div>
        </div>
      </nav>
      <div class="container" style="margin-top: 5%;">


        <div class="row">
          <h1>Control Panel</h1>
          <div class="col-md-6">
            <input type="button" class="btn btn-danger" onclick="getCurrentAccount();" value="Connect Metamask" />
            <input type="label" id="adres" value="Metamask is not connected" disabled="true" />
          </div>
          <div class="col-md-6">
            <input type="button" class="btn btn-primary" onclick="urun_ekle();" value="Add Products" />
            <input type="text" id="UrunAdi" placeholder="Product name" />
            <input type="text" id="UrunStok" placeholder="Product Quantity" />
          </div>
        </div>
        <br />
        <br />
        <div class="row">
          <div class="col">
            <h5>Wallet Address: <input type="text" id="urun_id" placeholder="enter address" /></h5>
            <input type="button" value="Withdraw Contract Balance" class="btn btn-success" id="stok_ekle"
              onclick={Stok_Ekle} />
          </div>
        </div>
        <br />
        <br />
        <div class="row">
          <div class="col-md-6">
            <h5>Donation Amount: <input type="text" id="kac_tane" placeholder="Donation in Etherum e.g 0.01" /></h5>
            <br />
            <h1>Donatable Products</h1>
            <div class="col" id="aday_listesi">
              <ul margin="15px">
                <li id="aday_index" margin="10px"></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App;
