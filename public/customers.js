$("#checkAll").change(function() {
  $('input:checkbox').not(this).prop('checked', this.checked);
  $('input:checkbox').not(this).each(function() {
    if (this.checked) {
      $(this).parent().parent().addClass("toggled-row");
    } else {
      $(this).parent().parent().removeClass("toggled-row");
    }
  })
});

$(".message-toggle").change(function() {
  if (this.checked) {
    $(this).parent().parent().addClass("toggled-row");
  } else {
    $(this).parent().parent().removeClass("toggled-row");
  }
});

$(".message-toggle").each(function() {
  if (this.checked) {
    $(this).parent().parent().addClass("toggled-row");
  }
});

$(".message-icon").click(function() {
  $("textarea[name=message]").select();
  document.execCommand("Copy")
});

// #b33380 red
// #e69926 orange
// #80cc80 light green
// #59bf40 dark green
