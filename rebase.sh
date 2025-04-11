#!/bin/bash
# calenzo/rebase.sh
echo "Starting rebase process for Calenzo..."
git pull && git checkout master && git pull && git rebase dev && git push && git checkout dev
echo "Rebase complete!"