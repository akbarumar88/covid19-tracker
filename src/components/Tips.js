import React, { Component } from "react"
import { View, Text,StyleSheet } from "react-native"
import Collapsible from 'react-native-collapsible'
import { TouchableNativeFeedback } from "react-native-gesture-handler"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'

export default class Tips extends Component {
  constructor(props) {
    super(props)

    this.state = {
      opened: '',
      tips: [
        {
          slug:"periksa",
          icon: "",
          judul: "Kapan saya harus memeriksakan diri?",
          deskripsi1: `Apabila Anda dihubungi oleh petugas kesehatan,
                      sebagai hasil analisa aplikasi Pedulilindungi, berarti
                      Anda punya riwayat kontak dengan penderita COVID-19
                      positif, PDP, atau ODP. Maka silakan periksakan diri
                      Anda.`,
          deskripsi2: `Selain itu, sesuai dengan prosedur yang sudah
                      ditetapkan oleh pihak berwenang atau pemerintah,
                      Anda juga dapat menghubungi 119 ext. 9 atau periksa
                      ke Rumah Sal
                      rujukan jika:`,
          guides: [
            `Pernah berkunjung ke daerah endemis COVID-19
              dalam 14 hari terakhir dan mengalami gejala
              seperti demam di atas 38°C, batuk, dan sesak
              nafas yang tidak kunjung membaik.`,

            `Pernah kontak langsung dengan pasien
              COVID-19 atau punya riwayat perjalanan ke
              daerah episentrum penyebaran virus, meski
              tak menunjukkan gejala, namun bisa saja Anda
              menjadi carrier coronavirus.`,

            `Mengalami gejala ringan-sedang yang mengarah
              ke COVID-19 diantaranya adalah demam, batuk,
              sesak napas yang tak kunjung reda, meski dirasa
              tidak ada riwayat kontak langsung dengan pasien
              atau berada di daerah episentrum.`,
          ],
          sumber: "Infografis Kementerian Kesehatan",
        },
        {
          slug: 'cegah-penyebaran',
          icon: "",
          judul:
            "Bagaimana cara mencegah penyebaran Coronavirus Disease (COVID-19)?",
          deskripsi1: `Bagaimana cara mencegah penyebaran Coronavirus Disease (COVID-19)? 
                      Beberapa cara yang dapat dilakukna untuk mencegah penularan COVID-19 adalah:`,
          guides: [
            `Jaga kesehatan dan kebugaran Anda agar sistem
            imunitas/kekebalan tubuh meningkat.`,

            `Cucilah tangan menggunakan sabun dan air
            mengalir, karena hal ini dapat membunuh virus
            yang ada di tangan kita. Hal ini murah dan mudah
            untuk dilakukan, untuk menghindari penularan
            dari tangan. Jika tidak ada air dan sabun, bisa
            menggunakan hand-sanitizer berbasis alkohol.`,

            `Upayakan menerapkan etika batuk dan bersin.
            Tutup hidung dan mulut Anda dengan tisu atau
            dengan lengan atas bagian dalam.`,

            `Jaga jarak saat bertemu dengan orang lain,
            sekurang-kurangnya satu meter, terutama dengan
            orang yang sedang menderita batuk, pilek, bersin,
            dan demam, karena saat seseorang terinfeksi
            penyakit saluran pernafasan seperti COVID-19,
            batuk/bersin dapat menghasilkan droplet yang
            mengandung virus.`,

            `Hindari menyentuh mata, hidung, dan mulut
            sebelum mencuci tangan. Karena mata, hidung,
            dan mulut dapat menjadi jalan masuk virus yang
            hinggap ke tangan yang belum dicuci.`,

            `Gunakan masker penutup hidung dan mulut ketika
            Anda sakit.`,

            `Buang tisu atau masker yang sudah digunakan ke
            tempat sampah kemudia cucilah tangan Anda.`,

            `Tunda perjalanan ke daerah yang terpapar dengan
            virus ini sampai ada informasi lebih lanjut.`,

            `Jauhi tempat-tempat keramaian atau berdiam diri
            di rumah selama waktu yang ditentukan oleh pihak
            berwenang.`,
          ],
          sumber: "WHO dan Kementerian Kesehatan",
        },
        {
          slug:'panduan-ibadah',
          icon: "",
          judul: "Panduan Ibadah Ramadan di tengah Pandemi COVID-19",
          guides: [
            `Umat Islam diwajibkan menjalankan ibadah puasa
            di bulan Ramadan dengan baik berdasarkan
            ketentuan fikih ibadah.`,

            `Sahur dan buka puasa dilakukan oleh individu atau
            keluarga inti, tidak perlu sahur on the road atau
            ifthar jama'i (buka puasa bersama).`,

            `Salat Tarawih dilakukan secara individual atau
            berjamaah bersama keluarga inti di rumah.`,

            `Tilawah atau tadarus AlI-Qur'an dilakukan di rumah
            masing-masing berdasarkan perintah Rasulullah
            SAW untuk menyinari rumah dengan tilawah
            Al-Qur'an.`,

            `Buka puasa bersama baik dilaksanakan di
            lembaga pemerintahan, lembaga swasta, masjid
            maupun musala ditiadakan.`,

            `Peringatan Nuzulul Qur'an dalam bentuk
            tablig dengan menghadirkan penceramah dan
            massa dalam jumlah besar, baik di lembaga
            pemerintahan, lembaga swasta, masjid maupun
            musala ditiadakan.`,

            `Tidak melakukan iktikaf di 10 (sepuluh) malam
            terakhir bulan Ramadan di masjid/musala.`,

            `Pelaksanaan Salat Idul Fitri yang lazimnya
            dilaksanakan secara berjamaah, baik di masjid
            atau di lapangan ditiadakan, untuk itu diharapkan
            terbitnya Fatwa MUI menjelang waktunya.`,
          ],
          sumber: "Kementrian Agama",
        },
        {
          slug: 'jaga-jarak',
          icon: "",
          judul: "Jaga Jarak intu Penting!",
          deskripsi1: `Bila penyebaran virus terjadi di lokasi tertentu, tindakan
                      mengurangi kontak antarwarga pertama-tama
                      dilakukan di lokasi-lokasi tersebut dan tidak langsung di
                      tingkat nasional.`,
          deskripsi2: `Caranya adalah dengan melakukan hal-hal sebagai
                      berikut:`,
          guides: [
            `Hindari pertemuan besar (lebih dari 10 orang).`,

            `Jaga jarak (1 meter atau lebih) dengan orang lain.`,

            `Jangan pergi ke sarana kesehatan kecuali
            diperlukan.`,

            `Bila Anda memiliki anggota keluarga atau kawan
            dirawat di rumah sakit, batasi pengunjung -
            terutama bila mereka anak-anak atau kelompok
            risiko tinggi (lanjut usia dan orang dengan
            penyakit yang dapat memperberat, misalnya
            gangguan jantung, diabetes dan penyakit kronis
            lainnya)`,

            `Orang berisiko tinggi sebaiknya tetap di rumah
            dan menghindari pertemuan atau kegiatan lain
            yang dapat membuatnya terpapar virus, termasuk
            melakukan perjalanan`,

            `Beri dukungan pada anggota keluarga (yang tidak
            tinggal di rumah Anda) ataupun tetangga yang
            terinfeksi tanpa harus bertemu langsung, misalnya
            melalui telepon ataupun aplikasi bertukar pesan
            lainnya.`,

            `Ikuti panduan resmi di wilayah Anda yang bisa saja
            merubah rutinitas termasuk kegiatan sekolah atau
            pekerjaan.`,

            `Ikuti perkembangan informasi karena
            situasi dapat berubah dengan cepat sesuai
            perkembangan penyakit dan penyebarannya.`,
          ],
          sumber: "covid19.go.id",
        },
        {
          slug: 'cara-pakai-masker',
          icon: "",
          judul: "Cara tepat menggunakan masker",
          guides: [
            `Sebelum memasang masker, cuci tangan pakai
            sabun dan air mengalir (minimal 20 detik) atau bila
            tidak tersedia, gunakan cairan pembersih tangan
            (minimal alkohol 60%).`,

            `Pasang masker menutupi hidung, mulut, sampai
            dagu. Pastikan tidak ada sela antara wajah dan
            masker.`,

            `Jangan buka tutup masker. Jangan menyentuh
            masker. Bila tersentuh, cuci tangan pakai sabun
            dan air mengalir (minimal 20 detik) atau bila
            tidak tersedia, gunakan cairan pembersih tangan
            (minimal alkohol 60%).`,

            `Ganti masker yang basah atau lembab dengan
            masker baru. Masker medis hanya boleh
            digunakan satu kali saja. Masker kain dapat
            digunakan berulang kali, namun harus dicuci
            terlebih dahulu jika ingin menggunakannya lagi.`,

            `Untuk membuka masker: lepaskan dari belakang.
            Jangan sentuh bagian depan masker. Untuk
            masker satu kali pakai, buang segera di tempat
            sampah tertutup atau kantong plastik. Untuk
            masker kain, segera cuci dengan deterjen. Untuk
            memasang masker baru, ikuti poin pertama.`,
          ],
          sumber: "covid19.go.id",
        },
      ],
    }
  }

  render() {
    const {tips} = this.state
    return (
      <View style={s.container}>
        {tips.map(tip => {
          <TouchableNativeFeedback>
            <View style={s.row}>
              <Icon name="lightbulb-on-outline" />
              <Text>{tip.judul}</Text>

            </View>
          </TouchableNativeFeedback>
        })}
      </View>
    )
  }
}

const s = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#f5f5f5'
  },
  row:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  }
})