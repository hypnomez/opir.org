// Generated by CoffeeScript 1.4.0
(function() {

  $(function() {
    return $('.cs-home-donate').click(function() {
      return $("<div>\n	<div class=\"uk-form\" style=\"width: 600px;margin-left: -300px;\">\n		<a class=\"uk-modal-close uk-close\"></a>\n		<h2 class=\"cs-center\">Допомогти сайту</h2>\n		<p>\n			Ми піклуємось про вашу безпеку та анонімність як на сайті, так і на вулицях країни.\n		</p>\n		<p>\n			Ми не збираємо жодної статистики про користувачів, ніде не зберігаємо вашу IP адресу чи будь-які пов’язані з вами дані.\n		</p>\n		<p>\n			Якщо у вас є бажання та можливість підтримати функціонування та розвиток сайту - ви можете зробити це так само безпечно та анонімно.\n		</p>\n		<p>\n			З вказаних вище міркувань на разі ми приймаємо допомогу у вигляді  <a href=\"https://bitcoin.org/\" target=\"_blank\"><u>Bitcoin</u></a>.\n		</p>\n		<p>\n			Гаманець Bitcoin:<b>1F8Wq9t562hHGcXfSDK7ZUZJhUjroZhwRg</b>\n		</p>\n	</div>\n</div>").appendTo('body').cs().modal('show').on('uk.modal.hide', function() {
        return $(this).remove();
      });
    });
  });

}).call(this);
