const nodeMailer = require('nodemailer');
require('dotenv').config();

const sendMail = async appointment => {
	return new Promise((resolve, reject) => {
		let transporter = nodeMailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.MAIL_USERNAME,
				pass: process.env.MAIL_PASSWORD,
			},
		});

		const mailOptions = {
			from: {
				name: process.env.MAIL_FROM_USER,
				address: process.env.MAIL_USERNAME,
			},
			to: appointment.email,
			subject: 'Đăt lịch khám tại phòng khám QTN',
			html: `<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title></title>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css"
			integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N"
			crossorigin="anonymous"
		/>
		<style>
			ul {
				list-style: none;
				padding: 0;
				margin: 0;
			}

			li {
				background-color: #f2f2f2;
				padding: 10px;
				margin-bottom: 5px;
				border-radius: 5px;
			}
		</style>
	</head>
	<body
		itemscope=""
		itemtype="http://schema.org/EmailMessage"
		style="
			font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
			box-sizing: border-box;
			font-size: 14px;
			-webkit-font-smoothing: antialiased;
			-webkit-text-size-adjust: none;
			width: 100% !important;
			height: 100%;
			line-height: 1.6em;
			background-color: #f6f6f6;
			margin: 0;
		"
		bgcolor="#f6f6f6"
	>
		<table
			class="body-wrap"
			style="
				font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
				box-sizing: border-box;
				font-size: 14px;
				width: 100%;
				background-color: #f6f6f6;
				margin: 0;
			"
			bgcolor="#f6f6f6"
		>
			<tbody>
				<tr
					style="
						font-family: 'Helvetica Neue', Helvetica, Arial,
							sans-serif;
						box-sizing: border-box;
						font-size: 14px;
						margin: 0;
					"
				>
					<td
						style="
							font-family: 'Helvetica Neue', Helvetica, Arial,
								sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
					<td
						class="container"
						width="600"
						style="
							font-family: 'Helvetica Neue', Helvetica, Arial,
								sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							display: block !important;
							max-width: 600px !important;
							clear: both !important;
							margin: 0 auto;
						"
						valign="top"
					>
						<div
							class="content"
							style="
								font-family: 'Helvetica Neue', Helvetica, Arial,
									sans-serif;
								box-sizing: border-box;
								font-size: 14px;
								max-width: 600px;
								display: block;
								margin: 0 auto;
								padding: 20px;
							"
						>
							<table
								class="main"
								width="100%"
								cellpadding="0"
								cellspacing="0"
								style="
									font-family: 'Helvetica Neue', Helvetica,
										Arial, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									overflow: hidden;
									border-radius: 7px;
									background-color: #fff;
									margin: 0;
									border: 1px solid #e9e9e9;
								"
								bgcolor="#fff"
							>
								<tbody>
									<tr
										style="
											font-family: 'Helvetica Neue',
												Helvetica, Arial, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="alert alert-warning"
											style="
												font-family: 'Helvetica Neue',
													Helvetica, Arial, sans-serif;
												box-sizing: border-box;
												font-size: 16px;
												vertical-align: top;
												color: #fff;
												font-weight: 500;
												text-align: center;
												border-radius: 3px 3px 0 0;
												background-color: #71b6f9;
												margin: 0;
												padding: 20px;
											"
											align="center"
											bgcolor="#71b6f9"
											valign="top"
										>
											<a href="#"
												><img
													src="https://i.ibb.co/9s4CFhk/logo.png"
													alt="logo"
													border="0"
													style="
														background-color: #f1f1f1;
														padding: 10px;
														border-radius: 10px;
													"
												/>
											</a>
										</td>
									</tr>
									<tr
										style="
											font-family: 'Helvetica Neue',
												Helvetica, Arial, sans-serif;
											box-sizing: border-box;
											font-size: 14px;
											margin: 0;
										"
									>
										<td
											class="content-wrap"
											style="
												font-family: 'Helvetica Neue',
													Helvetica, Arial, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												vertical-align: top;
												margin: 0;
												padding: 20px;
											"
											valign="top"
										>
											<table
												width="100%"
												cellpadding="0"
												cellspacing="0"
												style="
													font-family: 'Helvetica Neue',
														Helvetica, Arial,
														sans-serif;
													box-sizing: border-box;
													font-size: 14px;
													margin: 0;
												"
											>
												<tbody>
													<tr
														style="
															font-family: 'Helvetica Neue',
																Helvetica, Arial,
																sans-serif;
															box-sizing: border-box;
															font-size: 14px;
															margin: 0;
														"
													>
														<td
															class="content-block"
															style="
																font-family: 'Helvetica Neue',
																	Helvetica,
																	Arial,
																	sans-serif;
																box-sizing: border-box;
																font-size: 14px;
																vertical-align: top;
																margin: 0;
																padding: 0 0
																	20px;
															"
															valign="top"
														>
															Quý khách đã đặt
															lịch khám sau tại
															<strong
																>QTN Clinic:
															</strong>
														</td>
													</tr>
													<tr
														style="
															font-family: 'Helvetica Neue',
																Helvetica, Arial,
																sans-serif;
															box-sizing: border-box;
															font-size: 14px;
															margin: 0;
														"
													>
														<td
															class="content-block"
															style="
																font-family: 'Helvetica Neue',
																	Helvetica,
																	Arial,
																	sans-serif;
																box-sizing: border-box;
																font-size: 14px;
																vertical-align: top;
																margin: 0;
																padding: 0 0
																	20px;
															"
															valign="top"
														>
															<ul>
																<b
																	style="
																		color: red;
																	"
																	>THÔNG TIN
																	CÁ NHÂN:</b
																>
																<br />
																<li>
																	<strong>
																		Họ và
																		tên:
																	</strong>
																	${appointment.name}
																</li>
																<li>
																	<strong>
																		Ngày
																		sinh:
																	</strong>
																	${new Date(appointment.birthday).toLocaleDateString('en-GB')}
																</li>
																<li>
																	<strong>
																		Số điện
																		thoại:
																	</strong>
																	${appointment.phone_number}
																</li>
																<li>
																	<strong>
																		Email:
																	</strong>
																	${appointment.email}
																</li>
																<b
																	style="
																		color: red;
																	"
																>
																	LỊCH KHÁM:
																</b>
																<br />
																<li>
																	<strong>
																		Bác sĩ:
																	</strong>
																	${appointment.schedule.doctor.user.name}
																</li>
																<li>
																	<strong>
																		Chuyên
																		khoa:
																	</strong>
																	${appointment.schedule.doctor.speciality.name}
																</li>
																<li>
																	<strong>
																		Ngày
																		khám:
																	</strong>
																	${new Date(appointment.schedule.date).toLocaleDateString('en-GB')}
																</li>
																<li>
																	<strong>
																		Thời
																		gian:
																	</strong>
																	${appointment.schedule.shift.start_time.slice(0, -3)} -
																	${appointment.schedule.shift.end_time.slice(0, -3)}
																</li>
																<li>
																	<strong>
																		Địa chỉ:
																	</strong>
																	123 Nguyễn
																	Lương Bằng,
																	Hòa Khánh,
																	Đà Nẵng
																</li>
																<li>
																	<strong>
																		Giá
																		khám:
																	</strong>
																	${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
																		appointment
																			.schedule
																			.doctor
																			.price
																	)}
																</li>
															</ul>
														</td>
													</tr>
													<tr
														style="
															font-family: 'Helvetica Neue',
																Helvetica, Arial,
																sans-serif;
															box-sizing: border-box;
															font-size: 14px;
															margin: 0;
														"
													>
														<td
															class="content-block"
															style="
																font-family: 'Helvetica Neue',
																	Helvetica,
																	Arial,
																	sans-serif;
																box-sizing: border-box;
																font-size: 14px;
																vertical-align: top;
																margin: 0;
																padding: 0 0
																	20px;
															"
															valign="top"
														>
															Quý khách vui lòng
															chọn
															<b
																>Xác nhận đơn
																khám</b
															>
															để hoàn tất quá
															trình đặt lịch. Hoặc
															<b
																style="
																	color: red;
																"
																>Huỷ đơn khám</b
															>
															nếu quý khách không
															thể đến khám.
															<br />
															Mail này có hiệu lực
															trong
															<strong
																>10 phút</strong
															>.
															<br />
															<br />
															<div
																style="
																	text-align: center;
																"
															>
																<a
																	href="${appointment.host}/confirm-appointment/${appointment.token}"
																	target="_blank"
																	class="btn-primary"
																	style="
																		font-family: 'Helvetica Neue',
																			Helvetica,
																			Arial,
																			sans-serif;
																		box-sizing: border-box;
																		font-size: 14px;
																		color: #fff;
																		text-decoration: none;
																		line-height: 2em;
																		font-weight: bold;
																		text-align: center;
																		cursor: pointer;
																		display: inline-block;
																		border-radius: 5px;
																		background-color: #10c469;
																		margin: 0;
																		border-color: #10c469;
																		border-style: solid;
																		border-width: 8px
																			16px;
																		/* Add hover styles below */
																		transition: background-color
																			0.3s
																			ease-in-out;
																	"
																>
																	Xác nhận đơn
																	khám
																</a>
																&nbsp;&nbsp;&nbsp;&nbsp;
																<a
																	href="${appointment.host}/cancel-appointment/${appointment.token}"
																	target="_blank"
																	class="btn-danger"
																	style="
																		font-family: 'Helvetica Neue',
																			Helvetica,
																			Arial,
																			sans-serif;
																		box-sizing: border-box;
																		font-size: 14px;
																		color: #fff;
																		text-decoration: none;
																		line-height: 2em;
																		font-weight: bold;
																		text-align: center;
																		cursor: pointer;
																		display: inline-block;
																		border-radius: 5px;
																		background-color: #e41e1e;
																		margin: 0;
																		border-color: #e41e1e;
																		border-style: solid;
																		border-width: 8px
																			16px;
																		/* Add hover styles below */
																		transition: background-color
																			0.3s
																			ease-in-out;
																	"
																>
																	Huỷ đơn khám
																</a>
															</div>
														</td>
													</tr>
													<tr
														style="
															font-family: 'Helvetica Neue',
																Helvetica, Arial,
																sans-serif;
															box-sizing: border-box;
															font-size: 14px;
															margin: 0;
														"
													>
														<td
															class="content-block"
															style="
																font-family: 'Helvetica Neue',
																	Helvetica,
																	Arial,
																	sans-serif;
																box-sizing: border-box;
																font-size: 14px;
																vertical-align: top;
																margin: 0;
																padding: 0 0
																	20px;
															"
															valign="top"
														>
															Cảm ơn quý khách đã
															lựa chọn
															<b>QTN Clinic</b>
														</td>
													</tr>
												</tbody>
											</table>
										</td>
									</tr>
								</tbody>
							</table>
							<div
								style="
									font-family: 'Helvetica Neue', Helvetica,
										Arial, sans-serif;
									box-sizing: border-box;
									font-size: 14px;
									width: 100%;
									clear: both;
									color: #999;
									margin: 0;
									padding: 20px;
								"
							>
								<table
									width="100%"
									style="
										font-family: 'Helvetica Neue', Helvetica,
											Arial, sans-serif;
										box-sizing: border-box;
										font-size: 14px;
										margin: 0;
									"
								>
									<tbody>
										<tr
											style="
												font-family: 'Helvetica Neue',
													Helvetica, Arial, sans-serif;
												box-sizing: border-box;
												font-size: 14px;
												margin: 0;
											"
										></tr>
									</tbody>
								</table>
							</div>
						</div>
					</td>
					<td
						style="
							font-family: 'Helvetica Neue', Helvetica, Arial,
								sans-serif;
							box-sizing: border-box;
							font-size: 14px;
							vertical-align: top;
							margin: 0;
						"
						valign="top"
					></td>
				</tr>
			</tbody>
		</table>
	</body>
</html>
`,
		};

		transporter.sendMail(mailOptions, (err, info) => {
			if (err) {
				console.log(err);
				reject({ message: 'Error when send email' });
			} else {
				return resolve({ message: 'Send email successfully' });
			}
		});
	});
};

module.exports = { sendMail };
