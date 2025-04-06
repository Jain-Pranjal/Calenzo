
from django.contrib import admin
from .models import Task

class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'due_date', 'status', 'priority', 'user','sequence_number')
    search_fields = ('title', 'description')
    list_filter = ('status', 'priority', 'user')
    ordering = ('-created_at',)
    list_per_page = 20
    date_hierarchy = 'created_at'
    actions = ['mark_as_done']
    def mark_as_done(self, request, queryset):
        queryset.update(status='done')
        self.message_user(request, "Selected tasks marked as done.")


admin.site.register(Task, TaskAdmin)