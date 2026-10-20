project.md


Visual Studio Code için eklenti geliştiriceğiz bu eklenti sidebar'da duran ve tıklanınca solda bir LLM sohbet ekranı açan bir eklenti.
Açıldığında modern ve estetik bir chat arayüzü karşılayacak. Burda ollama ile yerel modellerle sohbet ediceğiz. modeller vs code projemize kod yazamayacak ama asistan olarak yardım edebilecek.

Modern tasarımına sahip olucak ve bir çok özelliğe sahip olucak (sessions ile sohbetleri bölebileceğiz, model seçebileceğiz, model oluşturma ile var olan bir modeli kopyalayıp; kvcache, tempature, sistem promtu gibi şeyler ayarlayabileceğiz...)

İlk önce sohbet ekranından başlıyalım eklenti açıldığında direkt yeni oturum (session) olarak açılır ortalanmış bir mesaj yazma bloğu olur üstte hoşgeldin $kullanıcı_adı gibi bir yazı olur.
sol üstte oturumlar düğmesi yer alır, olan oturumun adı yer alır, tıklayınca arama eşliğinde vir dropbox ile oturumlar listelenir.
** Oturumlar localde bir yerde kaydedilir.
sağ üstte yeni oturum tuşu yer alır. 

sohbet başlayınca mesaj yazma bloğu en alta kayar.
Bu blok 3 satırdan oluşur diyelim ilk 2 satır tamamen metin yazma kısmı olur son satır seçenekler olur sağ kısımda kvcache gibi kullanılan token gözükür (sınır olmaz ama üzeirne gelince input/output gibi gibi bilgielr çıkar) onun yanıında ise gönder tuşu olur
sol kısımda ise ayarlar tuşu yer alır (birazdan değiniceğim)
Yazı yazarken "enter" ile göndeririz "shift + enter" ile alt satıra geçeriz. metin yazarken satır sonuna gelince alt satıra geçeriz ve yazılan satır saysıı 2'yi geçerse 4 yazı satırına (toplam 5 satır olucak) kadar yukarı doğru genişler. 4'ten fazla olduğunda ise solda bir slider gözükür (görsel) ve mousela direkt kaydırma yapabiliriz.
sol kısmda ayarların sağında ise model seçme dropbox'u olur, seçili model yazar tıklayınca arama kutusuyla modeller listelenir.

Ayarlar kısmına gelirsek visual studio code'un kendi pop-up window'u açılır.
Ayarlar olarak 3 farklı menümüz var ilki oturumlar burda oturumları yönetebiliriz (dışarı aktarma ve silme)
Diğeri ise modeller sekmesi burda modeller listelenir. sağ üstte ekle tuşu olur tıklayınca 2 adet düğme gelir dropbox ile. İlki ollama'dan aktar diğeri var olan modelin kopyasını yarat olur.
İlk seçenekte bize bir popup açılır burda bizim eklemediğimiz ama ollama'da cihaza kurulu olan modeller listelenir tıklayınca 2 seçenek verir ilki direkt aktar diğeri düzenleyip aktar olur. Direkt aktar diyince ekler. düzenleyip aktar derse birazdan anlatıcağım kısım ile açılır.
Diğer seçenekte ise bir model seçeriz ve bu birazdan anlatıcğaım ksıım açılır.
O dediğim kısım ise modele sistem promtu kvcache ve tempature değeri ayarlamamıza olanak sağlar.
Modeller sekmesinde moddeller listelenir düzenleme ve silme yapabiliriz.
3. sekmemiz ise eklenti ayarları burda genel bir sistem promtu ve maximum token ayarlayabiliriz (sınırlandırma) ek olarak ollama api url'si girebiliriz (default ollama api endpoint'i ile gelmesi gerekli)


Şimdi ana kısma dönelim, promptu gönderdiğimizde ollama ile gidecek bize kelime kelime akış şeklinde metin gelicek.
Hata durumunda hata bilgisi yer alıcak.
Metin akarken modellerin kod blok tarzları geldiğinde pas geçilmeyip ona uygun o bölüm şekillencek mesela ´´´ python .....  ´´´ olduğunda python kodu yazıyor gibi. Bu geldiğinde o bölümde kod formatı (renkleri vs) yer alıcak ve sağ üstte kopyala tuşu yer alıcak.

Mesaj yazarken durdur tuşunu unutma bu arada gönder tuşu yerine geçicek. "esc" tuşu da kısayolu olucak.
Durdurılduğunda (iptal edildiğinde) metin kutusuna promptumuz geri gelicek yani düzenleme yapıp geri gönderebiliceğiz.

Cevap tamamlandığında cevabın en altında bölüm gelciek. solda cevabı kopyala ve cevap bilgileri tuşu olucak. Bu bilgileri açtığımızda kaç saniyede tamamlandığını, saniyede kaç token yazdığı gibi bilgileri göstericek.

Model o oturumdaki konuşmaları hatırlayabilecek.


Projede kullanılanlar:
! npm run compile ile derlenir.
esbuild kullanıyoruz.
typescript ile yazıyoruz. src/extension.ts bizim ana dosyamız
proje adımız "ollamachat", kimliğimiz "ramazanmuslu-ollamachat"

Projede yaparken hiç birşeyi atlamadan sırayla ilerle. package.json gibi dosyalarıda düzelt