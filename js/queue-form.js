/*
 * Form interactions for POST to /api/queue
 */
$(function() {
  var $form = $("#queue");
  init_add_another_mx_hostname();

  var url = new URL(window.location.href);
  var domain = url.searchParams.get('domain');
  if (domain) $('#domain-input').val(domain)

  $form.submit(function(e) {
    $form.find(".errors").hide();
    e.preventDefault();

    var domain = $form.find('input[name="domain"]').val(),
        url = $form.attr('action');

    $.ajax({
      type: 'POST',
      url: url,
      data: $form.serializeArray()
    }).done(function(data) {
      window.location = "/domain-submitted";
    }).fail(function(e, message) {
      if (e.responseText.message) {
        var message = e.responseText.message;
      } else if (e.status == 429) {
        var message = 'Rate limit exceeded. You may only queue three domains per hour.';
      } else {
        Raven.captureMessage('Received ' + e.status + ' with no error message')
        var message = 'Server error';
      }
      $form.find('#queue-errors')
        .text('Error queueing domain: ' + message)
        .show();
    });
  });
});

function init_add_another_mx_hostname() {
  var $add_another = $("#queue .add-another"),
    $mx_domains = $("#queue .mx-domain");

  // Hide all but the first mx-domain field
  $mx_domains.slice(1).hide();

  $add_another.click(function() {
    var $hidden_fields = $mx_domains.filter(":hidden");
    $hidden_fields.first().show();
    if ($hidden_fields.length <= 1)
      // Showed the last field, no more to show
      $add_another.hide()
  });
}
