<?php
/**
 * @package        Info
 * @category       modules
 * @author         Nazar Mokrynskyi <nazar@mokrynskyi.com>
 * @copyright      Copyright (c) 2014, Nazar Mokrynskyi
 * @license        MIT License, see license.txt
 */
namespace cs\modules\Info;

use cs\Language;

class Info {
	/**
	 * Get info
	 *
	 * @return string
	 */
	static function get () {
		switch (Language::instance()->clang) {
			case 'uk':
				return '
					<p><strong>Всеукраїнське Громадське Об’єднання OPIR.ORG</strong> — політично й фінансово незалежна громадська організація, що почала свою діяльність в найтрагічніші дні Української Революції 2013-2014 років за ініціативою групи молодих громадських активістів.</p>
					<p>Діяльність нашої організації направлена на створення <strong>інноваційних інструментів</strong> для вирішення суспільно-важливих проблем</p>
					<p>Ми розраховуємо на набуту Україною <strong>громадянську свідомість, відповідальність та ініціативність</strong> для використання таких інструментів з метою вирішення поставлених задач та <strong>проблем</strong></p>
					<h2 class="cs-center">Очі України</h2>
					<p>Проект в пілотному режимі працював на Президентських виборах 25.05.2014 і був успішно реалізовний під час Парламентських виборів 25.10.2014. Розрахований на циклічну реалізацію під час кожних наступних парламентських та президентських виборів.</p>
					<p><strong>Мета:</strong> забезпечення освітлення виборчого процесу, в разі виявлення значних фальсифікацій — використання доказів для анулювання результатів та за можливості перешкоджання порушенням через оперативне втручання.</p>
					<p><strong>Суть:</strong> можливість оперативного фіксування порушень та введення он-лайн відео-стрім спостереження з виборчих дільниць за допомогою мобільних додатків. Моніторинг таких порушень на геолокаційному веб-сервісі з відповідним організованим реагуванням громади в складі мобільних груп.</p>
					<p><strong>Наразі:</strong> ми готуємося до місцевих виборів і плануємо висвітлити виборчий процес у Києві. Наша ціль - забезпечити кожне з ~1100 відділень для голосування нашими спостерігачами-стрімерами, котрі зможуть фіксувати порушення, що значно впливають на підсумок голосування. Результатом стане альтернативний до ЦВК підрахунок результатів і відстоювання чесних результатів у суді.</p>
					<h2 class="cs-center">Контакти</h2>
					<p>Центральний офіс ВГО OPIR.ORG:</p>
					<p>м. Київ, вул. Костянтинівська, 25</p>
					<p><a href="mailto:info@opir.org">info@opir.org</a></p>
					<p>+380 93 01 222 11</p>
					<h2 class="cs-center">Партнери</h2>
					<p style="display:flex;display:-webkit-flex;justify-content:space-around;text-align:center;">
						<a href="http://www.hromadske.tv/">
							<img src="/components/modules/Info/includes/img/1.png" alt=""/>
						</a>
						<a href="http://www.cvu.org.ua/">
							<img src="/components/modules/Info/includes/img/2.png" alt=""/>
						</a>
						<a href="http://chesno.org/">
							<img src="/components/modules/Info/includes/img/3.png" alt=""/>
						</a>
					</p>
				';
			case 'ru':
				return '
					<p><strong>Общественная Организация OPIR.ORG</strong> — политически и финансово независимая общественная организация, начавшая свою деятельность в самые трагические дни Украинской Революции 2013-2014 годов по инициативе группы молодых общественных активистов.</p>
					<p>Деятельность нашей организации направлена на создание <strong>инновационных инструментов</strong> для решения общественно важных проблем</p>
					<p>Мы полагаемся на возросшую в Украине <strong>ггражданскую сознательность, ответственность и инициативность</strong> для использования таких инструментов с целью решения поставленных задач и <strong>проблем</strong></p>
					<h2 class="cs-center">Глаза Украины</h2>
					<p>Проект в пилотном режиме прошел во время президентских выборов 25.05.2014 и был успешно реализован во время Парламентских выборов 25.10.2014. Рассчитан на циклическую реализацию во время каждых следующих парламентских и президентских выборов.</p>
					<p><strong>Цель:</strong> обеспечение освещения избирательного процесса, в случае выявления значительных фальсификаций - использование доказательств для аннулирования результатов и по возможности препятствования нарушением через оперативное вмешательство.</p>
					<p><strong>Суть:</strong> возможность оперативного фиксирования нарушений и введение онлайн видео-стрим наблюдения с избирательных участков с помощью мобильных приложений. Мониторинг таких нарушений на геолокационном веб-сервисе с соответствующим организованным реагированием общества в составе мобильных групп.</p>
					<p><strong>Сейчас:</strong> мы готовимся к местным выборам и планируем осветить избирательный процесс в Киеве. Наша цель - обеспечить каждое из ~ 1100 отделений для голосования нашими наблюдателями-стримерами, которые смогут фиксировать нарушения, которые значительно влияют на итог голосования. Результатом станет альтернативный к ЦИК подсчет результатов и отстаивания честных результатов в суде.</p>
					<h2 class="cs-center">Контакты</h2>
					<p>Центральный офис ОО OPIR.ORG:</p>
					<p>г. Киев, ул . Константиновская, 25</p>
					<p><a href="mailto:info@opir.org">info@opir.org</a></p>
					<p>+380 93 01 222 11</p>
					<h2 class="cs-center">Партнеры</h2>
					<p style="display:flex;display:-webkit-flex;justify-content:space-around;text-align:center;">
						<a href="http://www.hromadske.tv/">
							<img src="/components/modules/Info/includes/img/1.png" alt=""/>
						</a>
						<a href="http://www.cvu.org.ua/">
							<img src="/components/modules/Info/includes/img/2.png" alt=""/>
						</a>
						<a href="http://chesno.org/">
							<img src="/components/modules/Info/includes/img/3.png" alt=""/>
						</a>
					</p>
				';
			case 'en':
			default:
				return '
					<p><strong>NGO OPIR.ORG</strong> — politically and financially independent NGO that started its activities in the most tragic days of Ukrainian Revolution 2013-2014 on the initiative of a group of young activists.</p>
					<p>The activities of our organization aimed to create <strong>innovative tools</strong> addressing socially important problems</p>
					<p>We believe Ukraine acquired <strong>civil consciousness, responsibility and initiative</strong> to use such tools for solving social tasks and <strong>problems</strong></p>
					<h2 class="cs-center">Eyes of Ukraine</h2>
					<p>The project tested during the presidential election held on 25 May 2014 and is designed for cyclical implementation during each of the next parliamentary and presidential elections. Successfully launched on parliamentary elections held on 25 October 2014.</p>
					<p><strong>Objective:</strong> to ensure transparency of electoral process in case of significant falsifications. Use of evidence for the annulment of results and if possible prevent violations.</p>
					<p><strong>Core:</strong> the possibility to quickly capture violations and the introduction of online video stream observation at polling stations through mobile applications. Monitoring of such violations on geolocation web service with an appropriate organized response of the community as part of mobile crews.</p>
					<p><strong>Now:</strong> we are preparing for local elections and we plan to highlight the election process in Kyev. Our goal - to provide each of the approximately 1100 precints by our streaming observers, which can capture the violations, which greatly affect the outcome of the vote. The result will be an alternative to CEC calculation of the results of votes and upholding fair outcomes in court.</p>
					<h2 class="cs-center">Contacts</h2>
					<p>The central office of NGO OPIR.ORG:</p>
					<p>25, Kostyantynivska str, Kyiv, Ukraine</p>
					<p><a href="mailto:info@opir.org">info@opir.org</a></p>
					<p>+380 93 01 222 11</p>
					<h2 class="cs-center">Partners</h2>
					<p style="display:flex;display:-webkit-flex;justify-content:space-around;text-align:center;">
						<a href="http://www.hromadske.tv/">
							<img src="/components/modules/Info/includes/img/1.png" alt=""/>
						</a>
						<a href="http://www.cvu.org.ua/">
							<img src="/components/modules/Info/includes/img/2.png" alt=""/>
						</a>
						<a href="http://chesno.org/">
							<img src="/components/modules/Info/includes/img/3.png" alt=""/>
						</a>
					</p>
				';
		}
	}
}
